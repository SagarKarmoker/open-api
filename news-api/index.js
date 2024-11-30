const express = require('express')
const app = express()
const fs = require('fs')  // Import the fs (file system) module
const path = require('path')  // To work with file paths
const cors = require('cors')
const port = 3000

app.use(cors())
app.use(express.json())

// Function to read data from data.json file
function getNewsData() {
    const filePath = path.join(__dirname, 'data.json')  // Get the absolute path of data.json
    const data = fs.readFileSync(filePath, 'utf8')  // Read the file content synchronously
    return JSON.parse(data)  // Parse the content and return it as an object/array
}

app.get('/', (req, res) => {
    res.send('Welcome to News API')
})

app.get('/news', (req, res) => {
    try {
        const newsArticles = getNewsData()  // Get the news articles from the file
        res.json(newsArticles)  // Send the articles as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Error reading news data', error: error.message })
    }
})


app.get('/news/categories', (req, res) => {
    try {
        const newsArticles = getNewsData()  // Get the news articles from the file

        // Extract categories from the articles and remove duplicates
        const categories = [...new Set(newsArticles.map(article => article.category))]

        // Send the unique categories as a JSON response
        res.json({ categories })
    } catch (error) {
        res.status(500).json({ message: 'Error reading news data', error: error.message })
    }
})

app.get('/news/:id', (req, res) => {
    try {
        const newsArticles = getNewsData()  // Get the news articles from the file
        const { id } = req.params  // Get the ID from the route parameters

        // Find the article with the matching ID
        const article = newsArticles.find(article => article.id === parseInt(id))

        if (!article) {
            // If the article doesn't exist, return a 404 error
            return res.status(404).json({ message: 'Article not found' })
        }

        // Send the found article as a JSON response
        res.json(article)
    } catch (error) {
        res.status(500).json({ message: 'Error reading news data', error: error.message })
    }
})


app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
})