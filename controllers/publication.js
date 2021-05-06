const Publication = require("../models/publication")
const User = require("../models/user")
const awsUploadImage = require("../utils/aws-upload-image")
const {v4: uuidv4} = require("uuid")

async function publish(file, { user }) {
    const { id } = user
    const { createReadStream, mimetype} = await file
    const extension = mimetype.split("/")[1]
    const fileName = `publication/${uuidv4()}.${extension}`
    const fileData = createReadStream()
    
    try {
        const { Location } = await awsUploadImage(fileData,fileName)
        const publication = new Publication({
            idUser: id,
            file: Location,
            typeFile: mimetype.split("/")[0],
            createdAt: Date.now()
        })
        publication.save()

        return {
            status: true,
            urlFile: Location
        }
        
    } catch (error) {
        console.log(error)
        return {
            status: null,
            urlFile: ""     
        }
    }
    
}

async function getPublications(username){

    const {_id} = await User.findOne({ username })
    if(!_id) throw new Error("Usuario no encontrado.")

    const publicationList = await Publication.find({idUser: _id}).sort({ createdAt: -1})
    
    return publicationList
}


module.exports = {
    publish,
    getPublications
}