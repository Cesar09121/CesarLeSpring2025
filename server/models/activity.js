const { connect } = require('./supabase')
const { CustomError, statusCodes } = require('./errors')
const data = require('../data/activity.json')

const TABLE_NAME = 'activities'


const BaseQuery = () => connect()
  .from(TABLE_NAME)
  .select('*', { count: 'exact' })

const isAdmin = true 

async function getAll(limit = 30, offset = 0, sort = 'created_at', order = 'desc') {
  const list = await BaseQuery()
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1)

  if (list.error) {
    throw list.error
  }

  return {
    items: list.data,
    total: list.count
  }
}

async function get(id) {
  const { data: item, error } = await BaseQuery()
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  if (!item) {
    throw new CustomError('Activity not found', statusCodes.NOT_FOUND)
  }

  return item
}

async function create(activity) {
  if (!isAdmin) {
    throw new CustomError('You are not authorized to create a new activity', statusCodes.UNAUTHORIZED)
  }

  const { data: newActivity, error } = await connect()
    .from(TABLE_NAME)
    .insert(activity)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return newActivity
}

async function update(id, activityData) {
  try {
      console.log('Updating activity in database:', { id, activityData });

      const { data, error } = await connect()
          .from(TABLE_NAME)
          .update(activityData)
          .eq('id', id)
          .select('*')
          .single();

      if (error) {
          console.error('Database error:', error.message);
          throw error;
      }

      return data;
  } catch (error) {
      console.error('Error updating activity:', error.message);
      throw error;
  }
}

async function remove(id) {
  if (!isAdmin) {
    throw new CustomError('You are not authorized to delete this activity', statusCodes.UNAUTHORIZED)
  }

  const { data: deletedActivity, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return deletedActivity
}

async function getStats(userId) {
  const { data, error } = await BaseQuery()
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return {
    totalActivities: data.length,
    totalDistance: data.reduce((sum, curr) => sum + curr.distance, 0),
    totalDuration: data.reduce((sum, curr) => sum + curr.duration, 0),
    avgDuration: data.reduce((sum, curr) => sum + curr.duration, 0) / data.length || 0,
    activityBreakdown: data.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1
      return acc
    }, {})
  }
}
async function seed() {
  console.log('Starting activity seed process...');
  
  if (!isAdmin) {
    throw new CustomError('You are not authorized to seed data', statusCodes.UNAUTHORIZED)
  }

  try {
  
    const { data: existingActivities, error: checkError } = await connect()
      .from(TABLE_NAME)
      .select('id');

    if (checkError) {
      console.error('Error checking existing activities:', checkError);
      throw checkError;
    }

    if (existingActivities?.length > 0) {
      console.log('Activities already exist in database');
      return { message: 'Activities already exist', data: existingActivities };
    }
    const results = [];
    for (const activity of data.activity) {
      const mappedActivity = mapToDB(activity);
      const { data: newActivity, error } = await connect()
        .from(TABLE_NAME)
        .insert(mappedActivity)
        .select('*')
        .single();

      if (error) {
        console.error('Error inserting activity:', error.message);
        throw error;
      }

      results.push(newActivity);
      console.log('Seeded activity:', newActivity.id);
    }

    console.log(`Successfully seeded ${results.length} activities`);
    return { message: 'Seeded successfully', data: results };

  }catch (error) {
    console.error('Failed to seed activities:', error);
    throw new CustomError(
      'Failed to seed activity data: ' + error.message,
      statusCodes.INTERNAL_SERVER_ERROR
    );
  }
}




  async function createActivity(req, res) {
  const { user_id, type, distance, distance_unit, duration, date, location_lat, location_lng } = req.body;

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert({
        user_id,
        type,
        distance,
        distance_unit,
        duration,
        date,
        location_lat,
        location_lng
      })
      .select('*')
      .single();

    if (activityError) {
      return res.status(400).json({ error: activityError.message });
    }

    return res.status(201).json({ message: 'Activity created successfully', activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateActivity(req, res) {
  const activityId = req.params.id; 
  const activityData = req.body; 

  try {

    const { data: existingActivity, error: fetchError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .single();

    if (fetchError || !existingActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const { data: updatedActivity, error: updateError } = await supabase
      .from('activities')
      .update(activityData)
      .eq('id', activityId)
      .select('*')
      .single();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
  } catch (error) {
    console.error('Error updating activity:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
function mapToDB(activity) {
  return {
    user_id: activity.user_id,
    type: activity.type,
    distance: activity.distance,
    distance_unit: activity.distance_unit,
    duration: activity.duration,
    date: activity.date,
   location: activity.location
  }
}

  

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  seed,
  getStats,
  createActivity,
  

}