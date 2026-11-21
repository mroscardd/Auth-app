import xss from 'xss'


export function xssProtection(req, res, next) {
    console.log(req.query)

    if (req.body && typeof req.body === 'object') {
        req.body = sanitize(req.body)
    }

    if (req.query && typeof req.query === 'object') {
        Object.assign(req.query, sanitize(req.query))
    }

    if (req.params && typeof req.params === 'object') {
        Object.assign(req.params, sanitize(req.params))
    }

    next()
}
  
const EXCLUDED_FIELDS = ['password']

function sanitize(data, currentKey='') {

    const xssConfig = {
        whiteList: {}, 
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script', 'style']
    }

    if(EXCLUDED_FIELDS.includes(currentKey)){
        return data
    }

    if (typeof data === 'string') {
        return xss(data, xssConfig )
    }

    if (Array.isArray(data)) {
        return data.map(e => sanitize(e, currentKey))
    }

    if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((e, key) => {
            e[key] = sanitize(data[key], key)
            return e
        }, {})
    }

    return data

}  
 

