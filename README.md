# Application Description

The Character Sheet is a application made for d20 system, based on D&D character sheet.

The simulated database works by writing and reading JSON files it creates on your computer, the folder name is 'db'.

Once a character is created it's indexed by Id and every change on it sheet is real-time saved.

Items and Spells will work just the same, when adding items to your character, a list will appear with every item/spell ever inserted by any characters. In the same page, there will be a option to create a new item/spell, once fully added, there will be a option to edit or delete it on the adding list.

The application is made with `Node.js`, being deployable thanks to `Electron`, the front-end comunicate with back-end through a restAPI and the fron-end is build in pre-compilated `Vue.js`, with style based on `Bootstrap`.

# Application Execution

1. Clone the repository
1. Install the project: $ npm i
1. Start the application: $ npm start

**Build**

1. $ npm run dist

# API Routing

HOST: https://127.0.0.1:37456

> GET: `/characters` => get all characters list, returnning only name and characterId
> POST: `/characters` => create a new character with the name passed in body
> DELETE: `/characters/:id` => delete the character with that characterId

> GET: `/characterSheet/:id` => get the Sheet of the character with that characterId
> PUT: `/characterSheet/:id` => update the simulated database with the character object passed in body

> GET: `/items` => get all items list, returning only name and itemId
> PUT: `/items` => update the item filtered by the property itemId inside the item object passed on the body
> POST: `/items` => create a new item with the properties passed on the body

> GET: `/items/:id` => get the item with all it's properties
> DELETE: `/items/:id` => delete the item with that itemId

> GET: `/items/constants` => get items constants to creation of items

> GET: `/spells` => get all spells list, returning only name and spellId
> PUT: `/spells` => update the spell filtered by the property spellId inside the spell object passed on the body
> POST: `/spells` => create a new spell with the properties passed on the body

> GET: `/spells/:id` => get the spell with all it's properties
> DELETE: `/spells/:id` => delete the spell with that spellId

> GET: `/spells/constants` => get spells constants to creation of spells
