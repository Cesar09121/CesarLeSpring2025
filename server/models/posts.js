const data = require("../data/post.json");
const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "posts";

const BaseQuery = () => connect().from(TABLE_NAME).select("*");

const isAdmin = true;
async function getAll(limit = 30, offset = 0, sort = "userId", order = "asc") {
    const list = await connect()
      .from(TABLE_NAME)
      .select("*")
      .order(sort, { ascending: order === "asc" })
      .range(offset, offset + limit - 1); // 0 based index but range is inclusive
    if (list.error) {
      throw list.error;
    }
    return {
      items: list.data,
      total: list.count,
    };
  }
  async function get(id, limit = 30, offset = 0) {
    const list = await connect()
      .from(TABLE_NAME)
      .select("*")
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
  async function create(item) {
    if (!isAdmin) {
      throw CustomError(
        "Sorry, you are not authorized to create a new item",
        statusCodes.UNAUTHORIZED
      );
    }
    const { data: newItem, error } = await connect()
      .from(TABLE_NAME)
      .insert(item)
      .select("*");
    if (error) {
      throw error;
    }
    return newItem;
  }
  
  async function update(userId, item) {
    if (!isAdmin) {
      throw CustomError(
        "Sorry, you are not authorized to update this item",
        statusCodes.UNAUTHORIZED
      );
    }
    const { data: updatedItem, error } = await connect()
      .from(TABLE_NAME)
      .update(item)
      .eq("user_id", userId)
      .select("*");
    if (error) {
      throw error;
    }
    return updatedItem;
  }
  
  async function seed() {
    const { data: users } = await connect().from("users").select("*");
    let i = 0;
    for (const item of data.items) {
      const user = users[i];
      i++;
      const insert = mapToDB(item, user.userId);
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
    type: item.type,
    duration: item.duration,
    email: item.email,
    username: item.username,
    location: item.location,
    distance: item.distance,
    date: item.date
  };
}

module.exports = {
  get,
  getAll,
  create,
  remove,
  seed,
};