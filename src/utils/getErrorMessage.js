export var getErrorMessage = function (err, alterText) {
    if (alterText === void 0) { alterText = "Bad request"; }
    return {
        message: err instanceof Error ? err.message : alterText,
    };
};
