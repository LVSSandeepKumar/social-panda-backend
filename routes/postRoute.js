const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const posts = await Post.find()
        .populate('createdBy')
        .populate('likes')
        .populate({
            path:'comments',
            populate : {
                path : 'createdBy',
                model : 'user'
            }
        })
        .sort({createdAt : -1});
        res.json(posts);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

router.post('/', async(req, res) => {
    try {
        const data = {
            postText : req.body.postText ,
            createdAt : req.body.createdAt ,
            createdBy : req.body.createdBy ,
            imageUrl : req.body.imageUrl
        }
        const postRes = await Post.create(data);
        res.status(201).json(postRes)
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}) 

router.put('/like/:postId', async(req, res) => {
    try {
        const postId = req.params.postId;
        const data = {
            userId : req.body.userId,
            isLiked : req.body.isLiked
        }
        const post = await Post.findById(postId);
        if(!post.likes) {
            const updatePost = await Post.findByIdAndUpdate(postId, {likes : []}, {
                runValidators:true, 
                upsert:true
            })
            await updatePost.save();
        }
        const updatedPost = await Post.findById(postId);
        data.isLiked 
            ? updatedPost.likes.push(data.userId)
            : updatedPost.likes.pop(data.userId);
        const result = await updatedPost.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

router.delete('/:postId', async(req, res) => {
    try {
        const postId = req.params.postId;
        const deletePostRes = await Post.findByIdAndDelete({_id : postId });
        res.status(201).json(deletePostRes);
    } catch (error) {
        res.status(500).json({message : error.message})
    }
})

module.exports=router;