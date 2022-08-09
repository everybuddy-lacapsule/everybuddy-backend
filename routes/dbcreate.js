var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
const StatusModel = require("../models/statuses");
const TypeJobsModel = require("../models/typeJobs");
const JobModel = require("../models/jobs");

const realUsers = [
  {
    admin: true,
    onboarding: false,
    firstName: "William",
    name: "Werlé",
    email: "williamwiut@gmail.com",
    pwd: "wouairley",
    avatar:
      "https://drive.google.com/open?id=1bpLl0LLCz33LLDSGt_P1NHtt0D3_ivJP",
    status: "#JUST CURIOUS",
    presentation: "",
    searchCurrent: "",
    tel: 604493876,
    capsule: {
      nbBatch: 55,
      campus: "Lyon",
      cursus: "",
    },
    address: { long: 4.8489, lat: 45.75466, city: "Paris", country: "FR" },
    work: {
      work: "DevOps",
      company: "L'Empire",
      dateDebut: "",
      typeWork: "Freelance",
    },
    linkRs: {
      linkedin: "",
      github: "",
    },
    tags: ["ReactNative"],
    buddies: [],
  },
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
]


const users = [
  /*
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

*/
];

router.get("/", async function (req, res, next) {
  for (let i = 0; i < realUsers.length; i++) {
    let newUser = new UserModel(realUsers[i]);
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
