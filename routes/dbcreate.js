var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
const StatusModel = require("../models/statuses");
const TypeJobsModel = require("../models/typeJobs");
const JobModel = require("../models/jobs");

require("dotenv").config();
const { API_MAP_TOKEN } = process.env;
const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: API_MAP_TOKEN,
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);


const passwordGenerator = (length) =>{
  var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var passwordLength = length;
  var password = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber +1);
   }
   return password;
  }

const realUsers = 
[
  {
      "name": "Werlé ",
      "firstname": "William ",
      "email": "williamwiut@gmail.com",
      "phone": "+33604493876",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "Thorel ",
      "firstname": "Mandy",
      "email": "mandythorel@gmail.com",
      "nbbatch": 50,
      "campus": "Paris",
      cursus: "Fullstack",

  },
  {
      "name": "ARROYO",
      "firstname": "Fabien",
      "email": "fabien_a09@outlook.com",
      "nbbatch": 50,
      "campus": "Paris",
      cursus: "Fullstack",

  },
  {
      "name": "LENEPVEU ",
      "firstname": "Mathieu",
      "email": "mathieu.lenepveu.perso@gmail.com",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "Chateau",
      "firstname": "Melanie ",
      "email": "m.chateau@triicom.fr",
      "phone": "0629964221",
      "nbbatch": 56,
      "campus": "Marseille",
      cursus: "Fullstack",

  },
  {
      "name": "DIALLO",
      "firstname": "Aboubacar",
      "email": "fbgbest2015@gmail.com",
      "nbbatch": 56,
      "campus": "Marseille",
      cursus: "Fullstack",

  },
  {
      "name": "Marchand",
      "firstname": "Augustin",
      "email": "augustin.le.dev@gmail.com",
      "phone": "0658511524",
      "nbbatch": 33,
      "campus": "Paris",
      cursus: "Fullstack",

  },
  {
      "name": "Nguyen",
      "firstname": "Huynh Thanh Qui",
      "email": "nguyenhtqui@gmail.com",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "Fresil",
      "firstname": "Alban",
      "email": "alban.fresil@gmail.com",
      "phone": "0689049066",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "SERRANO",
      "firstname": "Lucas",
      "email": "serrano.lucas@gmail.com",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "MELINAND",
      "firstname": "Xavier",
      "email": "x.melinand@gmail.com",
      "phone": "0667758858",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "SERRANO",
      "firstname": "Ren",
      "email": "rensean.01@gmail.com",
      "phone": "+33687636901",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "Elisabeth",
      "firstname": "Emmanuelle",
      "email": "eelisabeth.pro@gmail.com",
      "nbbatch": 30,
      "campus": "Paris",
      cursus: "Fullstack",

  },
  {
      "name": "Noel",
      "firstname": "Julien",
      "email": "contact@julien-noel.com",
      "phone": "0626026191",
      "nbbatch": 50,
      "campus": "Paris",
      cursus: "Fullstack",

  },
  {
      "name": "GRID-LEDONNÉ",
      "firstname": "Lucile",
      "email": "lucileglpro@gmail.com",
      "phone": "+262 692 40 85 86",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "Fornasier ",
      "firstname": "Mathys",
      "email": "mfornasier@yahoo.fr",
      "nbbatch": 55,
      "campus": "Lyon ",
      cursus: "Fullstack",

  },
  {
      "name": "BADJI",
      "firstname": "MICHAËL",
      "email": "michaelbadji1@gmail.com",
      "nbbatch": 56,
      "campus": "Marseille",
      cursus: "Fullstack",

  },
  {
      "name": "Wenadio ",
      "firstname": "Claudy",
      "email": "wenadio@outlook.fr",
      "phone": "0601734922",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "CHARON",
      "firstname": "Olivier",
      "email": "oli.charon@gmail.com",
      "phone": "0771816621",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",

  },
  {
      "name": "Humbert",
      "firstname": "Adrien",
      "email": "ahumbert@dimosoftware.com",
      "nbbatch": 55,
      "campus": "Lyon",
      cursus: "Fullstack",
  }
]


router.get("/", async function (req, res, next) {
  
  for (let i = 0; i < realUsers.length; i++) {
    var address = {
      long: null,
        lat: null,
        city: "",
        country: "",
    }
    if (realUsers[i].campus){
      const response = await geocoder.geocode(realUsers[i].campus);
       address = {
        long: Number.parseFloat(response[0].longitude),
        lat: Number.parseFloat(response[0].latitude),
        city: response[0].city,
        country: response[0].countryCode,
      };
    }
    
    password = passwordGenerator(10)
    let newUser = new UserModel(
      {admin:false,
        onboarding:false,
        pwd : password,
        avatar:"https://res.cloudinary.com/dcihy0wgo/image/upload/v1659865421/avatarH_...",
        presentation:"",
        searchCurrent:"",
        tel:null,
        name: realUsers[i]?.name,
        firstName: realUsers[i]?.firstname,
        email: realUsers[i]?.email,
        capsule: {
          nbBatch : realUsers[i]?.nbbatch,
          campus :  realUsers[i]?.campus,
          cursus: realUsers[i]?.cursus,
        },
        address: address,
        work : {
          work:"",
          company:"",
          dateDebut:null,
          typeWork:"",
        },
        linkRs:{
          linkedin:"",
          github: "",
        },
      });
    let newUserSaved = await newUser.save();
  }
  res.render("index", { title: "Create DB" });
});


/*----------------------ACTIVE ONCE TIME TO CREATE A COLLECTION : Create collection Status--------------------------*/

router.post("/createStatuses", async function (req, res, next) {
  const statuses = {
    statuses: ["# OPEN TO WORK", "# HIRING", "# PARTNER", "# JUST CURIOUS"],
  };
  let newStatuses = new StatusModel(statuses);

  let newStatusesSaved = await newStatuses.save();
  res.json({
    title: "Collection status created",
    collection: newStatusesSaved,
  });
});

/*----------------------ACTIVE ONCE TIME TO CREATE A COLLECTION : Create collection jobs / works --------------------------*/
router.post("/createJobs", async function (req, res, next) {
  const jobs = {
    jobs: [
      "Développeur",
      "Product Owner",
      "Data Scientist",
      "DevOps",
      "Scrum Master",
    ],
  };
  let newJobs = new JobModel(jobs);

  let newJobsSaved = await newJobs.save();
  res.json({
    title: "Collection jobs created",
    collection: newJobsSaved,
  });
});

/*----------------------ACTIVE ONCE TIME TO CREATE A COLLECTION : Create collection typeJobs / typeWorks --------------------------*/
router.post("/createTypeJobs", async function (req, res, next) {
  const typeJobs = {
    typeJobs: ["Entrepreneur", "En contrat", "Freelance", "En recherche"],
  };
  let newTypeJobs = new TypeJobsModel(typeJobs);

  let newTypeJobsSaved = await newTypeJobs.save();
  res.json({
    title: "Collection typeJobs created",
    collection: newTypeJobsSaved,
  });
});

module.exports = router;


// const realUsers = [
//   {
//     admin: true,
//     onboarding: false,
//     firstName: "William",
//     name: "Werlé",
//     email: "williamwiut@gmail.com",
//     pwd: "wouairley",
//     avatar:
//       "https://drive.google.com/open?id=1bpLl0LLCz33LLDSGt_P1NHtt0D3_ivJP",
//     status: "#JUST CURIOUS",
//     presentation: "",
//     searchCurrent: "",
//     tel: 604493876,
//     capsule: {
//       nbBatch: 55,
//       campus: "Lyon",
//       cursus: "",
//     },
//     address: { long: 4.8489, lat: 45.75466, city: "Paris", country: "FR" },
//     work: {
//       work: "DevOps",
//       company: "L'Empire",
//       dateDebut: "",
//       typeWork: "Freelance",
//     },
//     linkRs: {
//       linkedin: "",
//       github: "",
//     },
//     tags: ["ReactNative"],
//     buddies: [],
//   },
  // {
  //   admin: true,
  //   onboarding: false,
  //   firstName: "Mathieu",
  //   name: "Lepevneu",
  //   email: "mathieu.lenepveu.perso@gmail.com",
  //   pwd: "wouairley",
  //   avatar: "https://drive.google.com/open?id=1bpLl0LLCz33LLDSGt_P1NHtt0D3_ivJP",
  //   status: "#OPEN TO WORK",
  //   presentation: "",
  //   searchCurrent: "",
  //   tel: "",
  //   capsule: {
  //     nbBatch: 55,
  //     campus: "Lyon",
  //     cursus: "",
  //   },
  //   address: {long:  4.84890, lat: 45.75466, city: "Paris", country: "FR" },
  //   work: 
  //   {
  //     work: "DevOps",
  //     company: "L'Empire",
  //     dateDebut: "",
  //     typeWork: "Freelance",
  //   },
  //   linkRs: [],
  //   tags: ["ReactNative"],
  //   buddies: [],
  // },
// ]

/*
const users = [
  
    {
      admin: false,
      onboarding: false,
      firstName: "Alice",
      name: "Smith",
      email: "as@gmail.com",
      pwd: "123",
      avatar: "https://res.cloudinary.com/dcihy0wgo/image/upload/v1659865408/avatarF_egsplj.png",
      status: "#JUST CURIOUS",
      presentation: "Vous savez, moi je ne crois pas qu'il y ait de bonne ou de mauvaise situation. Moi, si je devais résumer ma vie aujourd'hui avec vous, je dirais que c'est d'abord des rencontres. Des gens qui m'ont tendu la main, peut-être à un moment où je ne pouvais pas, où j'étais seul chez moi. Et c'est assez curieux de se dire que les hasards, les rencontres, forgent une destinée... Parce que quand on a le goût de la chose, quand on a le goût de la chose bien faite, le beau geste, parfois on ne trouve pas l'interlocuteur en face je dirais, le miroir qui vous aide à avancer. Alors ça n'est pas mon cas, comme je disais là, puisque moi au contraire, j'ai pu : et je dis merci à la vie, je lui dis merci, je chante la vie, je danse la vie... je ne suis qu'amour ! Et finalement, quand beaucoup de gens aujourd'hui me disent « Mais comment fais-tu pour avoir cette humanité ? », et bien je leur réponds très simplement, je leur dis que c'est ce goût de l'amour ce goût donc qui m'a poussé aujourd'hui à entreprendre une construction mécanique, mais demain qui sait ? Peut-être simplement à me mettre au service de la communauté, à faire le don, le don de soi... \n",
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
      linkRs: {},
      tags: ["ReactNative"],
      buddies: [],
    },
    {
      admin: false,
      onboarding: false,
      firstName: "John",
      name: "Doe",
      email: "jg@gmail.com",
      pwd: "123",
      avatar: "https://img.freepik.com/vecteurs-premium/mignon-avatar-chat-robot-orange_79416-86.jpg",
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
      linkRs: {},
      tags: [ "Flutter","Backend"],
      buddies: [],
    },
    {
      admin: false,
      onboarding: false,
      firstName: "Tony",
      name: "Paul",
      email: "tp@gmail.com",
      pwd: "123",
      avatar: "https://tabatadreams.files.wordpress.com/2016/01/avatar-chat.jpg",
      status: "#OPEN TO WORK",
      presentation: "",
      searchCurrent: "",
      tel: 623455009,
      capsule: {
        nbBatch: 55,
        campus: "Paris",
        cursus: "DevOps",
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
      linkRs: {},
      tags: [ "Frontend", "Angular"],
      buddies: [],
    },

  {
    admin: false,
    onboarding: false,
    firstName: "Pascal",
    name: "Java",
    email: "pj@gmail.com",
    pwd: "123",
    avatar: "https://tabatadreams.files.wordpress.com/2016/01/avatar-chat.jpg",
    status: "#OPEN TO WORK",
    presentation: "",
    searchCurrent: "",
    tel: 623455009,
    capsule: {
      nbBatch: 55,
      campus: "Lyon",
      cursus: "DevOps",
    },
    address: { long: 4.759, lat: 45.75466, city: "Lyon", country: "FR" },
    work: {
      work: "Développeur",
      company: "PascalCompany",
      dateDebut: "",
      typeWork: "Entrepreneur",
    },
    linkRs: { linkedin: "", github: "" },
    tags: ["FullStack", "Backend", "Java", "API", "BDD", "Python","Kotlin", "Swift", "PHP", "Flutter", "ReactJS", "ReactNative", "JavaScript"],
    buddies: [],
  },
  {
    admin: false,
    onboarding: false,
    firstName: "Lyon",
    name: "Paris",
    email: "lp@gmail.com",
    pwd: "123",
    avatar: "https://tabatadreams.files.wordpress.com/2016/01/avatar-chat.jpg",
    status: "#OPEN TO WORK",
    presentation: "",
    searchCurrent: "",
    tel: 623455009,
    capsule: {
      nbBatch: 55,
      campus: "Lyon",
      cursus: "DevOps",
    },
    address: { long: 4.759, lat: 45.7545, city: "Lyon", country: "FR" },
    work: {
      work: "DevOps",
      company: "LyonCompany",
      dateDebut: "",
      typeWork: "Entrepreneur",
    },
    linkRs: {
      linkedin: "",
      github: "",
    },
    tags: ["API", "BDD", "ReactNative"],
    buddies: [],
  },
];
*/