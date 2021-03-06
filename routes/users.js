'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.get('/users', (req, res, next) => {
  knex('users')
  .orderBy('id')
  .then((users) => {
    res.json(users);
  })
  .catch((err) => {
    next(err)
  })
});

router.get('/users/:id', (req, res, next) =>{
  const id = req.params.id;
  knex('users')
  .where('id', id)
  .then((users) => {
    res.json(users)
  })
  .catch((err) => next(err))
});

router.post('/users', (req, res, next) => {

  const { first_name, last_name, email, password } = req.body

  knex('users')
  .insert({
    first_name: first_name,
    last_name: last_name,
    email: email,
    // stars,
    // comments,
    hashed_password: bcrypt.hashSync(password, salt)
    // token,
    // fb_user
  })
  .returning('*')
  .then((users)=>{
    let user = {
      id: users[0].id,
      first_name: users[0].first_name,
      last_name: users[0].last_name,
      email: users[0].email,
    }
    res.json(users)
  })
  .catch((err)=>next(err))
});

router.patch('/users/:id', function(req, res, next) {
// console.log('hit patch')
  const id = req.params.id
  // console.log(id)
  let password = req.body.password
  let hashed_password = bcrypt.hashSync(password, salt)
  // console.log(hashed_password)
  // console.log(id)
  const { first_name, last_name, email } = req.body

  let patchUser = {}

  if (first_name) {
    patchUser.first_name = first_name
  }
  if (last_name) {
    patchUser.last_name = last_name
  }
  if (email) {
    patchUser.email = email
  }
  if (password) {
    patchUser.hashed_password = hashed_password
  }
  console.log(id)
  console.log(patchUser)
  knex('users')
  .where('id', id)

  .then((users)=>{
    console.log(users)
    knex('users')
    .update(patchUser)
    .where('id', id)
    .returning('*')

    .then((users)=>{
      console.log(users)
      let patchUser = {
        // id: users[0].id,
        first_name: users[0].first_name,
        last_name: users[0].last_name,
        email: users[0].email,
        hashed_password: users[0].hashed_password
      }
      res.json(patchUser)
    })
    .catch((err)=>next(err))
  })
})

router.delete('/users/:id', function(req, res, next) {
  const id = req.params.id
  knex('users')

  .then((users)=>{
    knex('users')
    .del()
    .where('id', id)
    .returning('*')

      .then((users)=>{
        let user = {
          title: users[0].title,
          author: users[0].author,
          genre: users[0].genre,
          description: users[0].description,
          coverUrl: users[0].cover_url
        }
        res.json(user)
      })
    .catch((err)=>next(err))
  })
});

module.exports = router;
