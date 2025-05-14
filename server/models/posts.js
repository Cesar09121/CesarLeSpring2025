const data = require("../data/posts.json");
const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "posts";

const BaseQuery = () => connect().from(TABLE_NAME).select("*");

const isAdmin = true;

async function getAll(
  limit = 30,
  offset = 0,
  sort = "created_at",
  order = "asc"
) {
  const list = await BaseQuery()
    .order(sort, { ascending: order === "asc" })
    .range(offset, offset + limit - 1); 
  if (list.error) {
    throw list.error;
  }
  return {
    items: list.data,
    total: list.count,
  };
}

async function get(
  id,
  limit = 30,
  offset = 0,
  sort = "created_at",
  order = "asc"
) {
  const list = await BaseQuery()
    .order(sort, { ascending: order === "asc" })
    .range(offset, offset + limit - 1)
    .eq("userId", id);
  if (list.error) {
    throw list.error;
  }
  return {
    items: list.data,
    total: list.count,
  };
}

async function create(post) {
  try{
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .insert(post)
      .select("*");
    if (error) throw error;
    return data[0];
   } catch (error) {
      console.error("Error in create post:", error);
      throw error;
    } 
    
  }

async function remove(id) {
  try{
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .delete()
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return data[0];
  }catch (error) {
    console.error(`Error in remove post ${id}:`, error);
    throw error;
  }
}
async function update(id, post) {
  try {
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .update(post)
      .eq("id", id)
      .select("*");
      
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Error in update post ${id}:`, error);
    throw error;
  }
}
async function seed() {
  const { data: users } = await connect().from("users").select("*");

  for (const item of data.items) {
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];

    const insert = mapToDB(item, randomUser.user_id);
    const { data: newItem, error } = await connect()
      .from(TABLE_NAME)
      .insert(insert)
      .select("*");
    if (error) {
      throw error;
    }
  }
  return { message: "Seeded successfully" };
}

function mapToDB(item, userId) {
  return {
    userId: userId,
    title: item.title,
    type: item.exercise,
    duration: item.duration,
    email: item.email,
    username: item.username,
  };
}

module.exports = {
  get,
  getAll,
  create,
  remove,
  seed,
  update
};