/**
 * Created by 201101575 on 2015-07-20.
 */
// router.js
function route(handle, pathname, response) {
    console.log("About to route a request for" + pathname);
    if (typeof handle[pathname] === 'function') {
        return handle[pathname](response);
    } else {
        console.log("No request handler found for" + pathname);
        return "404 Not found";
    }
}

exports.route = route;