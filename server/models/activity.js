const { connect } = require("./supabase");
const data = require("../data/activity.json");

const TABLE_NAME = "activities";

const BaseQuery = () => connect().from(TABLE_NAME).select("*");

async function getAll(limit = 30, offset = 0, sort = "date", order = "desc") {
  try {
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .select("*", { count: 'exact' })
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return {
      items: data || [],
      total: data.length,
    };
  } catch (error) {
    console.error("Error in getAll activities:", error);
    throw error;
  }
}

async function get(userId) {
  try {
    console.log("Getting activities for userId:", userId);
    
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .select("*")
      .eq("userId", userId);  
    
    if (error) {
      console.error("Error in activity.get:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} activities for user ${userId}`);
    return {
      items: data || [],
      total: data?.length || 0,
    };
  } catch (error) {
    console.error(`Error getting activities for user ${userId}:`, error);
    throw error;
  }
}

async function create(activity) {
  try {
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .insert(activity)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
}

async function update(id, activity) {
  try {
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .update(activity)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error(`Error updating activity ${id}:`, error);
    throw error;
  }
}

async function remove(id) {
  try {
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error(`Error removing activity ${id}:`, error);
    throw error;
  }
}

async function getStats(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is required for stats");
    }
    
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .select("*")
      .eq("userId", userId);
    
    if (error) throw error;
  
    return {
      stats: {
        totalActivities: data.length,
        totalDistance: data.reduce((sum, act) => sum + (Number(act.distance) || 0), 0),
        totalDuration: data.reduce((sum, act) => sum + (Number(act.duration) || 0), 0),
      }
    };
  } catch (error) {
    console.error(`Error getting stats for user ${userId}:`, error);
    throw error;
  }
}

async function seed() {
  try {
    if (!data || !data.activities || !Array.isArray(data.activities)) {
      throw new Error("Invalid activity data format for seeding");
    }
    
    const results = [];
    for (const activity of data.activities) {
      const { data: newActivity, error } = await connect()
        .from(TABLE_NAME)
        .insert(activity)
        .select();
      
      if (error) throw error;
      
      results.push(newActivity[0]);
    }
    
    return { 
      message: "Activities seeded successfully",
      count: results.length
    };
  } catch (error) {
    console.error("Error seeding activities:", error);
    throw error;
  }
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
  getStats,
  seed
};