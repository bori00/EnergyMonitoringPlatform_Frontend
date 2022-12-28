export const GRPC_CONFIG = {
    TIMELESS_REQUEST_TIMEOUT_SECONDS: 3600000
};

function getTimelessRequestTimeout() {
    return new Date( Date.now() + GRPC_CONFIG.TIMELESS_REQUEST_TIMEOUT_SECONDS)
}

export {
    getTimelessRequestTimeout
}