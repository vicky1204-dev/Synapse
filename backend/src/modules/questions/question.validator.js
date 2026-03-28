import joi from "joi"

export const validateAddQuestion = (data)=>{
    const schema = joi.object({
        title: joi.string().trim().required(),
        body: joi.string().allow(""),
        tags: joi.array().items(joi.string().trim()).unique().default([]),
    })

    return schema.validate(data)
}