module.exports = {
    plugins: [
        require("postcss-preset-env")({
            stage: 1,
            features: {
                "prefers-color-scheme-query": false,
                "custom-properties": false,
                "logical-properties-and-values": false,
            },
        }),
    ],
}
