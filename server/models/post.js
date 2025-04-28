const database = require('../database')
const {connect } = require('./supabase')
const { CustomError, statusCodes } = require('./errors')


const BaseQ=(query) => {connect().from(TABLE_NAME).select('*')}

async function getAll(limit = 30, offset = 0, sort = 'created_at', order = 'desc') {
    const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .order(sort, { ascending: order === 'asc' })
        .range(offset, offset + limit - 1)

    if (error) throw error
    return { items: data, total: count }
}

async function get(id) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    if (!data) throw new CustomError('Post not found', statusCodes.NOT_FOUND)
    return data
}

async function create(post) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(post)
        .select()
        .single()

    if (error) throw error
    return data
}

async function update(id, post) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(post)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

async function remove(id) {
    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id)

    if (error) throw error
    return { message: 'Post deleted successfully' }
}

module.exports = {
    getAll,
    get,
    create,
    update,
    remove
}