const { connect } = require('./supabase')
const { CustomError, statusCodes } = require('./errors')

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

async function update(id, activity) {
  if (!isAdmin) {
    throw new CustomError('You are not authorized to update this activity', statusCodes.UNAUTHORIZED)
  }

  const { data: updatedActivity, error } = await connect()
    .from(TABLE_NAME)
    .update(activity)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return updatedActivity
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
    for (const activity of data.activity) {
      const insert = mapToDB(activity)
      const { data: newActivity, error } = await connect()
        .from(TABLE_NAME)
        .insert(insert)
        .select('*')
  
      if (error) {
        console.error('Error seeding activity:', error)
        throw error
      }
  
      console.log('Seeded activity:', newActivity)
    }
  
    return { message: 'Seeded successfully' }
  }
  function mapToDB(activity) {
    return {
      id: activity.id,
      user_id: activity.userId,
      type: activity.type,
      distance: activity.distance,
      distance_unit: activity.distanceUnit,
      duration: activity.duration,
      date: activity.date,
      location_lat: activity.location.lat,
      location_lng: activity.location.lng
    }
  }
  

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  seed

}