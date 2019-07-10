const express = require('express');

const Posts = require('./posts-model.js'); // <<< update the path

const router = express.Router();

router.use(express.json());

/////GETS//////

router.get('/', async (req, res) => {
    try {
      const posts = await Posts.find(req.query);
      res.status(200).json(posts);
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the posts',
      });
    }
  });

  router.get('/:id', async (req, res) => {
    console.log(`hit /:id with ${req.id}`);
    try {
      const posts = await Posts.findById(req.params.id);
  
      if (posts && posts.length) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the posts',
      });
    }
  });

  router.get('/:id/comments', (req, res) => {
    console.log('hit /:id/comments');
    const { id } = req.params;
  
    Posts.findPostComments(id)
      .then(comments => {
        if (comments && comments.length) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ message: 'cannot find it' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  ////POSTS/////

  router.post('/', async (req, res) => {
    try {
      const post = await Posts.insert(req.body);
      res.status(201).json(post);
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error adding the post',
      });
    }
  });

  router.post('/:id/comments', (req, res) => {

      Posts.insertComment(req.body)
        .then(result => {
          res.status(201).json(result);
        })
        .catch(error => {
          res.status(500).json(error);
        });
  });

  ///DELETE///

  router.delete('/:id', async (req, res) => {
    try {
      const count = await Posts.remove(req.params.id);
      if (count > 0) {
        res.status(200).json({ message: 'The post has been nuked' });
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error removing the post',
      });
    }
  });

  ///PUT///

  router.put('/:id', async (req, res) => {
    try {
      const post = await Posts.update(req.params.id, req.body);
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'The post could not be found' });
      }
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error updating the post',
      });
    }
  });


module.exports = router;