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
  

function sanitize(data) {

    const xssConfig = {
        whiteList: {}, 
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    }

    if (typeof data === 'string') {
        return xss(data, xssConfig )
    }

    if (Array.isArray(data)) {
        return data.map(e => sanitize(e))
    }

    if (data !== null && typeof data === 'object') {
        return Object.keys(data).reduce((e, key) => {
            e[key] = sanitize(data[key])
            return e
        }, {})
    }

    return data

}  
 

