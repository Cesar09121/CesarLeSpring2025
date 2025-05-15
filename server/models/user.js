const { connect } = require('./supabase') 
const { CustomError, statusCodes } = require('./errors')

const TABLE_NAME = 'users'
const BaseQuery = () => connect()
  .from(TABLE_NAME)
  .select('*', { count: 'estimated' })

const isAdmin = true 

async function getAll(limit = 30, offset = 0, sort = 'created_at', order = 'desc') {
  console.log(`Fetching users with limit: ${limit}, offset: ${offset}, sort: ${sort}, order: ${order}`)
    const list = await BaseQuery()
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit - 1) 

    console.log('Database response:', list)
  if (list.error) {
    throw list.error
  }

  return {
    items: list.data,
    total: list.count
  }
}

async function get(id) {
    console.log(`Fetching user with id: ${id}`) 
  
    const { data: item, error } = await connect()
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
  
    if (error) {
      console.error('Database error:', error) 
      throw error
    }
  
    if (!item || item.length === 0) {
      console.error(`User with id ${id} not found`) 
      throw new CustomError('User not found', statusCodes.NOT_FOUND)
    }
  
    return item[0]
  }

async function login(username, password) {
  const { data: user, error } = await connect()
    .from(TABLE_NAME)
    .select('id, username, name, role, password')
    .eq('username', username)
    .single()

  if (error) {
    throw new CustomError('Invalid credentials: Something went wrong', statusCodes.UNAUTHORIZED)
  }

  if (!user) {
    throw new CustomError('User not found', statusCodes.NOT_FOUND)
  }

  if (password !== user.password) {
    throw new CustomError('Invalid credentials: Password', statusCodes.UNAUTHORIZED)
  }

  delete user.password

  return {
    success: true,
    user
  }
}

async function create(user) {
  if (!isAdmin) {
    throw new CustomError('You are not authorized to create a new user', statusCodes.UNAUTHORIZED)
  }

  const { data: newUser, error } = await connect()
    .from(TABLE_NAME)
    .insert(user)
    .select('*')

  if (error) {
    throw error
  }

  return newUser
}

async function update(id, user) {
  if (!isAdmin) {
    throw new CustomError('You are not authorized to update this user', statusCodes.UNAUTHORIZED)
  }
  const { data: updatedUser, error } = await connect()
    .from(TABLE_NAME)
    .update(user)
    .eq('id', id)
    .select('*')

  if (error) {
    throw error
  }

  return updatedUser
}

async function remove(id) {
  if (!isAdmin) {
    throw new CustomError('You are not authorized to delete this user', statusCodes.UNAUTHORIZED)
  }

  const { data: deletedUser, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return deletedUser
}
async function seed(){
  if (!isAdmin) {
    throw new CustomError('You are not authorized to seed data', statusCodes.UNAUTHORIZED)
  }

  try {
  
    const { data: existingUsers, error: checkError } = await connect()
      .from(TABLE_NAME)
      .select('username');

    if (checkError) {
      console.error('Error checking existing users:', checkError);
      throw checkError;
    }

    if (existingUsers?.length > 0) {
      console.log('Users already exist in database');
      return existingUsers;
    }
    const { data, error } = await connect()
      .from(TABLE_NAME)
      .insert(users)
      .select('*');

    if (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
    console.log(`Successfully seeded ${data.length} users`);
    return data;

  } catch (error) {
    console.error('Failed to seed users:', error);
    throw new CustomError(
      'Failed to seed user data: ' + error.message,
      statusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function search(query, limit = 30, offset = 0, sort = 'id', order = 'desc'){
    const { data: items, error, count } = await BaseQuery()
    .or(`name.ilike.%${query}%`)
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + limit -1)
    if (error) {
        throw error
    }
    return {
        items,
        total: count
    }
} 

module.exports = {
  getAll,
  get,
  login,
  create,
  update,
  remove,
  seed
}