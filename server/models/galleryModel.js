const prisma = require('../db')

const createImage = async (data) => {
    const max = await prisma.galleryImage.findFirst({
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
    })
    const nextOrder = (max?.orderIndex ?? -1) + 1
    return prisma.galleryImage.create({
        data: {
            filename: data.filename,
            filepath: data.filepath,
            mimetype: data.mimetype,
            orderIndex: nextOrder,
        },
    })
}

const getImages = async () => {
    return prisma.galleryImage.findMany({ orderBy: { orderIndex: 'asc' } })
}

const deleteImage = async (id) => {
    return prisma.galleryImage.delete({ where: { id: Number(id) } })
}

const updateOrder = async (orderedIds) => {
    await prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.galleryImage.update({
                where: { id: Number(id) },
                data: { orderIndex: index },
            })
        )
    )
}

module.exports = {
    createImage,
    getImages,
    deleteImage,
    updateOrder,
}
