const router = require('express').Router();
const db = require('./db');

// This route returns as JSON the top 10 movies with the longest runTime
router.get('/longest-duration-movies', async (req, res, next) => {
    try {
        let sql = `SELECT tconst,primaryTitle,runtimeMinutes,genres FROM tbl_movies order by runtimeMinutes desc limit 10`;
        const [result, _] = await db.execute(sql);
        res.status(200).json(result);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// This route takes JSON as input for new movie and saves it into the database
router.post('/new-movie', async (req, res, next) => {
    try {
        const { tconst, titleType, primaryTitle, runtimeMinutes, genres } =
            req.body;
        // i dont know what to validate, you have not given me such details
        let sql = `
            INSERT INTO tbl_movies(tconst,titleType,primaryTitle,runtimeMinutes,genres)
            VALUES('${tconst}','${titleType}','${primaryTitle}',${runtimeMinutes},'${genres}')
            `;
        const [result, _] = await db.execute(sql);
        res.status(201).send('success');
    } catch (err) {
        if (err.code == 'ER_DUP_ENTRY') {
            err.statusCode = 409;
        }
        res.status(err.statusCode || 500).json({ error: err.message });
    }
});

// This route returns as JSON the movies with an averageRating > 6.0, in sorted
// order by averageRating
router.get('/top-rated-movies', async (req, res, next) => {
    try {
        let sql = `select tbl_movies.tconst,tbl_movies.primaryTitle,tbl_movies.genres, tbl_ratings.averageRating
        from tbl_movies 
        join  tbl_ratings on tbl_movies.tconst = tbl_ratings.tconst
        where tbl_ratings.averageRating > 6.0  order by tbl_ratings.averageRating`;

        const [result, _] = await db.execute(sql);
        res.status(200).json(result);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// Show a list of all movies genre-wise with Subtotals of their numVotes
router.get('/genre-movies-with-subtotals', async (req, res, next) => {
    try {
        let sql = `SELECT tbl_movies.genres,tbl_movies.primaryTitle,tbl_ratings.numVotes,sum(tbl_ratings.numVotes) as total
                FROM tbl_movies
                JOIN tbl_ratings ON tbl_movies.tconst = tbl_ratings.tconst
                GROUP BY tbl_movies.genres`;

        const [result, _] = await db.execute(sql);
        res.status(200).json(result);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// increment runtimeMinutes of all Movies using only SQL query
router.put('/update-runtime-minutes', async (req, res, next) => {
    try {
        let sql = `UPDATE tbl_movies
        SET runtimeMinutes = runtimeMinutes +
          IF(genres = "Documentary" ,15, IF(genres = "Animation", 30, 45))`;

        const [result, _] = await db.execute(sql);
        res.status(200).json({
            message: 'runtime minutes updated successfylly',
            result,
        });
    } catch (err) {
        res.json({ error: err.message });
    }
});
module.exports = router;
