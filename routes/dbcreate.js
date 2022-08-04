var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

const users = [
    {
      admin: false,
      onboarding: false,
      firstName: "Alice",
      name: "Smith",
      email: "as@gmail.com",
      pwd: "123",
      avatar: "https://place-hold.it/300",
      status: "#JUST CURIOUS",
      presentation: "",
      searchCurrent: "",
      tel: 623455589,
      capsule: {
        nbBatch: 55,
        campus: "Paris",
        cursus: "Dev web",
      },
      address: {long: 2.34280, lat: 48.85756, city: "Paris", country: "FR" },
      work: 
      {
        work: "DevOps",
        company: "ABCompany",
        dateDebut: "",
        typeWork: "Freelance",
      },
      linkRs: [],
      tags: ["ReactNative"],
      buddies: [],
      discussion: [],
    },
    {
      admin: false,
      onboarding: false,
      firstName: "Jonh",
      name: "Doe",
      email: "jg@gmail.com",
      pwd: "123",
      avatar: "https://place-hold.it/300",
      status: "#HIRING",
      presentation: "",
      searchCurrent: "",
      tel: 623456789,
      capsule: {
        nbBatch: 55,
        campus: "Lyon",
        cursus: "Data Scientist",
      },
      address: {long: 4.84890, lat: 45.75466, city: "Lyon", country: "FR" },
      work: 
        {
          work: "Product Owner",
          company: "ABCompany",
          dateDebut: "",
          typeWork: "En contrat",
        },
      linkRs: [],
      tags: [ "Flutter","Backend"],
      buddies: [],
      discussion: [],
    },
    {
      admin: false,
      onboarding: false,
      firstName: "Tony",
      name: "Paul",
      email: "tp@gmail.com",
      pwd: "123",
      avatar: "https://place-hold.it/300",
      status: "#OPEN TO WORK",
      presentation: "",
      searchCurrent: "",
      tel: 623455009,
      capsule: {
        nbBatch: 55,
        campus: "Paris",
        cursus: "Dev web",
      },
      address: {long: 4.84890, lat: 45.75466, city: "Lyon", country: "FR" },
      work: 
        {
          work: "Développeur",
          company: "FartCompany",
          dateDebut: "",
          typeWork: "Entrepreneur",
        }
      ,
      linkRs: [],
      tags: [ "Frontend", "Angular"],
      buddies: [],
      discussion: [],
    },
  ];
  
  router.get("/", async function (req, res, next) {
  
    for (let i = 0; i < users.length; i++) {
      let newUser = new UserModel(users[i]);
      let newUserSaved = await newUser.save();
    }
    res.render("index", { title: "Create DB" });
  });
  
  
  
  
  
  
  
  
  
  
  module.exports = router;
  