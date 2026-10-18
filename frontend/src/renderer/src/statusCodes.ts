export interface StatusCode {
  code: number
  title: string
  summary: string
  example: string
  usedFor: string
}

export const ALL_CODES: StatusCode[] = [
  {
    code: 100, title: 'Continue',
    summary: 'The server has received the request headers and the client should proceed to send the body.',
    example: 'Uploading a large file — the server says "keep going" before you send the full payload.',
    usedFor: 'Avoids wasting bandwidth sending a large body the server would reject outright.',
  },
  {
    code: 101, title: 'Switching Protocols',
    summary: 'The server is switching to the protocol the client requested.',
    example: 'Upgrading an HTTP connection to WebSocket — this is the handshake response.',
    usedFor: 'Protocol upgrades, most commonly HTTP → WebSocket.',
  },
  {
    code: 102, title: 'Processing',
    summary: 'The server has received the request and is working on it, but has no response yet.',
    example: 'A long-running file conversion — the server acknowledges it\'s busy so the client doesn\'t time out.',
    usedFor: 'Prevents client timeouts on operations that take a while to complete.',
  },
  {
    code: 103, title: 'Early Hints',
    summary: 'A preliminary response that lets browsers start loading resources before the final response arrives.',
    example: 'The server sends Link headers for CSS and JS files before it\'s finished generating the HTML.',
    usedFor: 'Performance optimisation — gives browsers a head-start on fetching subresources.',
  },
  {
    code: 200, title: 'OK',
    summary: 'The request succeeded and the response contains the result.',
    example: 'Loading any webpage — the server returns the HTML with a 200.',
    usedFor: 'The standard success response for GET, POST, PUT, and PATCH requests.',
  },
  {
    code: 201, title: 'Created',
    summary: 'The request succeeded and a new resource was created.',
    example: 'Submitting a sign-up form — the server creates your account and returns 201.',
    usedFor: 'Confirms a POST or PUT created something new; often includes a Location header pointing to it.',
  },
  {
    code: 202, title: 'Accepted',
    summary: 'The request has been accepted for processing, but processing hasn\'t completed yet.',
    example: 'Triggering a report generation — the job is queued but won\'t be ready for a few seconds.',
    usedFor: 'Async operations where work happens in the background after the request is received.',
  },
  {
    code: 203, title: 'Non-Authoritative Information',
    summary: 'The response is a modified or cached copy from a proxy, not the origin server\'s exact response.',
    example: 'A CDN transforms the original response headers before forwarding it to you.',
    usedFor: 'Signals the content came through a proxy that may have altered the original.',
  },
  {
    code: 204, title: 'No Content',
    summary: 'The request succeeded but there is nothing to return.',
    example: 'An autosave firing in the background — the server confirms it worked but sends back nothing.',
    usedFor: 'DELETE or PATCH requests that succeed but have nothing meaningful to return.',
  },
  {
    code: 205, title: 'Reset Content',
    summary: 'The request succeeded; the client should reset the document view (e.g. clear a form).',
    example: 'Submitting a feedback form — the server says "done, now clear the form for the next entry."',
    usedFor: 'Tells the client to reset UI state after a successful submission.',
  },
  {
    code: 206, title: 'Partial Content',
    summary: 'The server is delivering only part of the resource, as requested by a Range header.',
    example: 'Streaming a video — your browser requests chunks as you watch.',
    usedFor: 'Resumable downloads, video streaming, and any scenario requiring a specific byte range.',
  },
  {
    code: 207, title: 'Multi-Status',
    summary: 'The response body contains multiple separate status codes for a batch of operations.',
    example: 'A WebDAV request deleting several files at once — each file gets its own status in the body.',
    usedFor: 'WebDAV batch operations and APIs that handle multiple sub-requests in a single call.',
  },
  {
    code: 208, title: 'Already Reported',
    summary: 'The resource members were already listed in a previous 207 response and won\'t be repeated.',
    example: 'A WebDAV PROPFIND hitting the same resource via two different paths — only reported once.',
    usedFor: 'Avoids duplicate entries in 207 Multi-Status WebDAV responses.',
  },
  {
    code: 226, title: 'IM Used',
    summary: 'The server fulfilled a GET and the response is the result of one or more delta encodings.',
    example: 'The server sends only what changed from your cached version, not the full resource.',
    usedFor: 'HTTP delta encoding (RFC 3229) — rarely seen outside specialist caching setups.',
  },
  {
    code: 300, title: 'Multiple Choices',
    summary: 'The requested resource has multiple representations and the client must choose one.',
    example: 'A document available in English and French — the server lists both and asks you to pick.',
    usedFor: 'Content negotiation when the server can\'t automatically determine the best representation.',
  },
  {
    code: 301, title: 'Moved Permanently',
    summary: 'The resource has permanently moved to a new URL. Update your bookmarks.',
    example: 'A site migrating from HTTP to HTTPS — every old URL permanently redirects to the new one.',
    usedFor: 'Permanent URL changes; search engines transfer SEO ranking to the new URL.',
  },
  {
    code: 302, title: 'Found',
    summary: 'The resource is temporarily at a different URL; keep using the original in the future.',
    example: 'Being sent to a login page while accessing a protected resource — you\'ll return to this URL after.',
    usedFor: 'Temporary redirects; search engines don\'t update their index for 302s.',
  },
  {
    code: 303, title: 'See Other',
    summary: 'The response to this request can be found at a different URL via a GET request.',
    example: 'After submitting a POST form, you\'re redirected to a confirmation page to prevent re-submission.',
    usedFor: 'Post/Redirect/Get pattern — prevents duplicate form submissions on browser back/refresh.',
  },
  {
    code: 304, title: 'Not Modified',
    summary: 'Your cached version is still valid — use what you already have.',
    example: 'Refreshing a page — your browser sends the cached version\'s timestamp, and the server says nothing changed.',
    usedFor: 'Conditional GET requests; saves bandwidth by not resending unchanged resources.',
  },
  {
    code: 305, title: 'Use Proxy',
    summary: 'The resource must be accessed through the proxy specified in the Location header.',
    example: 'Deprecated — you\'d essentially never see this in the wild today.',
    usedFor: 'Originally forced proxy use; deprecated in HTTP/1.1 due to security concerns.',
  },
  {
    code: 306, title: 'Switch Proxy / UNUSED',
    summary: 'This code is no longer used and is reserved.',
    example: 'Never seen in practice — it was briefly "Switch Proxy" in an early HTTP/1.1 draft.',
    usedFor: 'Reserved; has no current function.',
  },
  {
    code: 307, title: 'Temporary Redirect',
    summary: 'The resource is temporarily elsewhere; repeat the request there using the same HTTP method.',
    example: 'A POST to an API endpoint that\'s briefly moved — unlike 302, the client must keep using POST.',
    usedFor: 'Temporary redirects where the original HTTP method must be preserved.',
  },
  {
    code: 308, title: 'Permanent Redirect',
    summary: 'The resource has permanently moved; repeat all future requests to the new URL using the same method.',
    example: 'An API endpoint permanently relocated — like 301, but POST stays POST instead of becoming GET.',
    usedFor: 'Permanent redirects for non-GET requests where method preservation matters.',
  },
  {
    code: 400, title: 'Bad Request',
    summary: 'The server can\'t understand the request due to invalid syntax or bad data.',
    example: 'Sending malformed JSON to an API, or a field that fails validation.',
    usedFor: 'Generic "you sent something wrong" — covers malformed syntax, invalid params, missing required fields.',
  },
  {
    code: 401, title: 'Unauthorized',
    summary: 'Authentication is required and has not been provided or has failed.',
    example: 'Hitting a protected API endpoint without a token, or with an expired one.',
    usedFor: 'Prompts the client to authenticate; response usually includes a WWW-Authenticate header.',
  },
  {
    code: 402, title: 'Payment Required',
    summary: 'Reserved for future use; sometimes used by services to indicate a payment wall.',
    example: 'A SaaS API returning this when your free tier limit is exceeded.',
    usedFor: 'Officially reserved; informally used by some APIs to gate paid features.',
  },
  {
    code: 403, title: 'Forbidden',
    summary: 'The server understood the request but refuses to fulfil it — you don\'t have permission.',
    example: 'Trying to access an admin page while logged in as a regular user.',
    usedFor: 'Authorisation failures — unlike 401, the server knows who you are but still won\'t let you in.',
  },
  {
    code: 404, title: 'Not Found',
    summary: 'The server can\'t find the requested resource — it doesn\'t exist at this URL.',
    example: 'Visiting a deleted article, a mistyped URL, or a removed product page.',
    usedFor: 'Signals a missing resource without revealing whether it ever existed.',
  },
  {
    code: 405, title: 'Method Not Allowed',
    summary: 'The HTTP method used is not supported for this endpoint.',
    example: 'Sending a DELETE request to an endpoint that only accepts GET and POST.',
    usedFor: 'Enforces which methods an endpoint supports; response includes an Allow header with valid methods.',
  },
  {
    code: 406, title: 'Not Acceptable',
    summary: 'The server can\'t produce a response matching the client\'s Accept headers.',
    example: 'Requesting application/xml from an API that only returns application/json.',
    usedFor: 'Content negotiation failure — the resource exists but not in the format you asked for.',
  },
  {
    code: 407, title: 'Proxy Authentication Required',
    summary: 'You must authenticate with an intermediate proxy before the request can proceed.',
    example: 'Connecting through a corporate proxy that requires you to log in first.',
    usedFor: 'Like 401 but for proxies — the Proxy-Authenticate header tells the client how to authenticate.',
  },
  {
    code: 408, title: 'Request Timeout',
    summary: 'The server timed out waiting for the client to send a complete request.',
    example: 'Starting to upload a file but taking too long — the server gives up and closes the connection.',
    usedFor: 'Frees up idle server connections; the client can retry the request.',
  },
  {
    code: 409, title: 'Conflict',
    summary: 'The request conflicts with the current state of the resource.',
    example: 'Trying to create a username that\'s already taken, or editing a record someone else just updated.',
    usedFor: 'Concurrency conflicts, duplicate resource prevention, version mismatches in APIs.',
  },
  {
    code: 410, title: 'Gone',
    summary: 'The resource has been permanently deleted and will not come back.',
    example: 'A news article permanently removed — the site knows it existed but it\'s gone for good.',
    usedFor: 'A definitive "this is dead" signal; tells search crawlers to remove the URL from their index.',
  },
  {
    code: 411, title: 'Length Required',
    summary: 'The request must include a Content-Length header.',
    example: 'Sending a POST body without specifying its size.',
    usedFor: 'Servers that need content length upfront to allocate resources or validate the payload.',
  },
  {
    code: 412, title: 'Precondition Failed',
    summary: 'A precondition in the request headers was false on the server.',
    example: 'Sending a PUT with If-Match, but the resource was modified since your last fetch.',
    usedFor: 'Conditional requests to prevent accidental overwrites — part of optimistic concurrency control.',
  },
  {
    code: 413, title: 'Content/Payload Too Large',
    summary: 'The request body is larger than the server is willing to process.',
    example: 'Uploading a 50 MB image when the server only accepts files up to 10 MB.',
    usedFor: 'Protects servers from oversized payloads; response may include a Retry-After header.',
  },
  {
    code: 414, title: 'URI Too Long',
    summary: 'The URL is too long for the server to process.',
    example: 'A search with hundreds of filters appended as query parameters.',
    usedFor: 'Protects servers from excessively long URLs; usually means data should be in a POST body instead.',
  },
  {
    code: 415, title: 'Unsupported Media Type',
    summary: 'The server doesn\'t support the Content-Type of the request body.',
    example: 'Sending multipart/form-data to an endpoint that only accepts application/json.',
    usedFor: 'Enforces content type requirements; the client needs to re-encode and resend.',
  },
  {
    code: 416, title: 'Range Not Satisfiable',
    summary: 'The byte range specified in the Range header can\'t be fulfilled.',
    example: 'Requesting bytes 500–1000 of a file that\'s only 300 bytes long.',
    usedFor: 'Returned when a range request goes out of bounds; response includes actual resource size.',
  },
  {
    code: 417, title: 'Expectation Failed',
    summary: 'The server can\'t meet the requirements in the Expect request header.',
    example: 'Sending Expect: 100-continue but the server rejects the body before you send it.',
    usedFor: 'Rare in everyday web development; signals the server won\'t honour an Expect directive.',
  },
  {
    code: 418, title: "I'm a Teapot",
    summary: 'The server refuses to brew coffee because it is, permanently, a teapot.',
    example: 'Some APIs implement this as a joke response on certain endpoints.',
    usedFor: 'An April Fools\' RFC (2324) that stuck — used humorously, never seriously.',
  },
  {
    code: 421, title: 'Misdirected Request',
    summary: 'The request was sent to a server that can\'t produce a response for that host.',
    example: 'An HTTP/2 request reaching a server not configured to handle that domain.',
    usedFor: 'Tells the client to retry on a different connection or server.',
  },
  {
    code: 422, title: 'Unprocessable Content',
    summary: 'The request was well-formed but contained semantic errors the server can\'t process.',
    example: 'A form where the syntax is valid JSON but the email field contains an invalid address.',
    usedFor: 'API validation errors — the format was fine, but the business logic rejected the data.',
  },
  {
    code: 423, title: 'Locked',
    summary: 'The resource is locked and can\'t be modified right now.',
    example: 'A WebDAV file checked out by another user for editing.',
    usedFor: 'WebDAV locking — prevents concurrent writes to the same resource.',
  },
  {
    code: 424, title: 'Failed Dependency',
    summary: 'The request failed because a previous request it depended on also failed.',
    example: 'A WebDAV batch operation where a MOVE fails because the LOCK it needed was rejected.',
    usedFor: 'WebDAV and batch APIs where operations are chained and one failure cascades.',
  },
  {
    code: 425, title: 'Too Early',
    summary: 'The server won\'t process a request that might be replayed.',
    example: 'An early-data TLS 1.3 request that could be a replay attack.',
    usedFor: 'TLS 1.3 early data protection — prevents replay attacks before the handshake fully completes.',
  },
  {
    code: 426, title: 'Upgrade Required',
    summary: 'The client must switch to a different protocol before the server will respond.',
    example: 'Accessing an HTTPS-only endpoint over plain HTTP.',
    usedFor: 'Forces protocol upgrades; response includes an Upgrade header with the required protocol.',
  },
  {
    code: 428, title: 'Precondition Required',
    summary: 'The server requires the request to include a conditional header to prevent conflicts.',
    example: 'A PUT that needs an If-Match header to confirm you\'re editing the latest version.',
    usedFor: 'Enforces optimistic concurrency — protects against accidental overwrites in concurrent environments.',
  },
  {
    code: 429, title: 'Too Many Requests',
    summary: 'You\'ve sent too many requests in a given time window.',
    example: 'Hitting a public API too fast — it throttles you and may include a Retry-After header.',
    usedFor: 'Rate limiting; protects server resources from overuse or abuse.',
  },
  {
    code: 431, title: 'Request Header Fields Too Large',
    summary: 'The request\'s HTTP headers are too large for the server to process.',
    example: 'An enormous Cookie header from a site that\'s accumulated too many cookies over time.',
    usedFor: 'Protects servers from oversized header blocks; individual or total header size may be the issue.',
  },
  {
    code: 451, title: 'Unavailable For Legal Reasons',
    summary: 'The resource has been blocked for legal reasons such as a court order or censorship.',
    example: 'A website blocked in your country due to copyright law or a government takedown.',
    usedFor: 'Legal censorship, GDPR takedowns, copyright blocks — a transparent alternative to silently returning 403.',
  },
  {
    code: 500, title: 'Internal Server Error',
    summary: 'The server hit an unexpected condition and couldn\'t complete the request.',
    example: 'An unhandled exception in server-side code — something crashed that shouldn\'t have.',
    usedFor: 'The catch-all for unexpected server failures — something went wrong on the server\'s end.',
  },
  {
    code: 501, title: 'Not Implemented',
    summary: 'The server doesn\'t support the HTTP method used in the request.',
    example: 'Sending a PATCH request to a server that hasn\'t implemented that method.',
    usedFor: 'Signals an unimplemented method; different from 405 (method is known, just not allowed here).',
  },
  {
    code: 502, title: 'Bad Gateway',
    summary: 'The server, acting as a gateway, received an invalid response from an upstream server.',
    example: 'Your reverse proxy (nginx/Cloudflare) can\'t reach or gets garbage from the app server behind it.',
    usedFor: 'Infrastructure issues between servers — the middleman got a bad response from the backend.',
  },
  {
    code: 503, title: 'Service Unavailable',
    summary: 'The server is temporarily unable to handle requests — usually overloaded or down for maintenance.',
    example: 'A site during a traffic spike, or taken offline for a planned deployment.',
    usedFor: 'Temporary outages; often includes a Retry-After header saying when to try again.',
  },
  {
    code: 504, title: 'Gateway Timeout',
    summary: 'The server, acting as a gateway, timed out waiting for a response from an upstream server.',
    example: 'A slow database query or microservice takes too long — the proxy gives up waiting.',
    usedFor: 'Upstream timeout in a multi-server setup; the middleman waited too long for the backend.',
  },
  {
    code: 505, title: 'HTTP Version Not Supported',
    summary: 'The server doesn\'t support the HTTP protocol version used in the request.',
    example: 'Sending an HTTP/3 request to a server that only understands HTTP/1.1.',
    usedFor: 'Signals a protocol version mismatch between client and server.',
  },
  {
    code: 506, title: 'Variant Also Negotiates',
    summary: 'The server has a configuration error — the chosen variant is itself set up to use content negotiation.',
    example: 'A circular reference in the server\'s content negotiation config.',
    usedFor: 'Indicates a server misconfiguration in transparent content negotiation; rarely seen.',
  },
  {
    code: 507, title: 'Insufficient Storage',
    summary: 'The server can\'t store the data needed to complete the request.',
    example: 'A WebDAV server with a full disk when you try to upload a file.',
    usedFor: 'WebDAV storage quota or disk-full scenarios; used by some cloud storage APIs too.',
  },
  {
    code: 508, title: 'Loop Detected',
    summary: 'The server detected an infinite loop while processing the request.',
    example: 'A WebDAV operation that keeps recursively referencing itself.',
    usedFor: 'WebDAV binding loops — prevents the server getting stuck in infinite recursion.',
  },
  {
    code: 510, title: 'Not Extended',
    summary: 'The server requires further extensions to the request before it can be processed.',
    example: 'A request missing a required HTTP extension the server needs.',
    usedFor: 'HTTP extension framework (RFC 2774); essentially unused in modern web development.',
  },
  {
    code: 511, title: 'Network Authentication Required',
    summary: 'You must authenticate with the network before your request can proceed.',
    example: 'Connecting to hotel or airport Wi-Fi — you see this before being redirected to the captive portal login.',
    usedFor: 'Captive portal detection; tells clients they need to authenticate at the network level, not the app level.',
  },
]

const COMMON_CODE_NUMBERS = new Set([
  200, 201, 202, 204,
  301, 302, 304,
  400, 401, 403, 404, 405, 408, 409, 410,
  418, 429,
  500, 502, 503, 504,
])

export const COMMON_CODES: StatusCode[] = ALL_CODES.filter(c =>
  COMMON_CODE_NUMBERS.has(c.code)
)

export function shuffleStatusCodes<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  return copy
}
