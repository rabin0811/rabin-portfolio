const prisma = require('../prismaClient')

/* SEND MESSAGE */

const sendMessage = async (req, res) => {

  try {

    const {
      name,
      email,
      subject,
      message
    } = req.body

    const newMessage =
      await prisma.contact.create({

        data: {
          name,
          email,
          subject,
          message
        }

      })

    res.status(201).json({

      success: true,

      message: 'Message sent successfully',

      data: newMessage

    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: error.message
    })

  }

}

/* GET ALL MESSAGES */

const getMessages = async (req, res) => {

  try {

    const messages =
      await prisma.contact.findMany({

        orderBy: {
          createdAt: 'desc'
        }

      })

    res.status(200).json(messages)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: error.message
    })

  }

}

module.exports = {
  sendMessage,
  getMessages
}