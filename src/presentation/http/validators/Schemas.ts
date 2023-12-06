import Joi from 'joi'

export const makeRepositoriesParamsSchema = Joi.object().keys({
  username: Joi.string().regex(/^[A-Za-z]+$/),
})

export const makeRepositoriesQuerySchema = Joi.object().keys({
  sort: Joi.string()
    .regex(/\b(?:created|updated|pushed|full_name)\b/)
    .optional(),
  direction: Joi.string()
    .regex(/\b(?:asc|desc)\b/)
    .optional(),
  per_page: Joi.number().max(100).optional(),
  page: Joi.number().optional(),
})
