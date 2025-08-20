import express from 'express'
import connectToDatabase from './db.js'
import cors from 'cors'

const app = express()
const port = 3000 

app.use(express.json())
app.use(cors({
  origin: "https://todo-app-frontend-24js.onrender.com"
}))


let db;

app.listen(port, async () => {
    console.log(`todo app backed server server started at port ${port}`)
    db = await connectToDatabase('todo-db')
})

app.get('/test', (req, res) => {
    res.send('ApI is up!')
})

// API 1 - Create Todo 
app.post('/create-todo', async (req, res) => {
  try {
    let body = req.body;
    await db.collection('todo').insertOne(body);
    res.status(201).json({ msg: "Todo inserted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
});

// API 2 - Read All Todo 
app.get('/read-todos', async (req, res) => {
    try{
        let todoList = await db.collection('todo').find().toArray();
        res.status(200).json(todoList)
    } catch (error) {
        res.status(500).json({ msg: "internal server occur"})
    }
})

// API 3 - Read Single Todo
app.get('/read-todo', async (req, res) => {
  try {
    let queryTodoId = req.query.todoId;  
    let todo = await db.collection('todo').findOne({ todoId: queryTodoId });

    if (!todo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message
    });
  }
});

// API 4 
app.patch('/update-todo', async (req, res) => {
    try {
        let queryTodoId = req.query.todoId
        let reqBody = req.body

        let result = await db.collection('todo').updateOne({ "todoId": queryTodoId }, { $set: reqBody})
        if (result.matchedCount === 0 ) {
            res.status(404).json({ msg: 'todo not found'})
        } else 
            res.status(201).json({ msg: 'todo updated successfully'})
    } catch(error) {
        res.status(500).json({
            msg: "internal server occour",
            error: error.messgae
        })
    }
})

// API 5
app.delete('/delete-todo', async (req, res) => {
    try{
    let queryTodoId = req.query.todoId;
    let result = await db.collection('todo').deleteOne({ 'todoId': queryTodoId})

    if(result.deletedCount === 0) {
        res.status(404).json({ msg:'todo not found'})
    } else {
        res.status(201).json({ msg: 'todo deleted'})
    }
    } catch(error) {
        res.status(500).json({
            msg: "internal server occour",
            error: error.message
        })
    }
})
