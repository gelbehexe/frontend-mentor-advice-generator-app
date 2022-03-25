const { DefinePlugin } = require("webpack")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ESLintPlugin = require("eslint-webpack-plugin")

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

// noinspection JSValidateTypes
/**
 * @type {Function}
 */
const strftime = require("strftime")

const { VueLoaderPlugin } = require("vue-loader")
const appData = require("./buildLib/appData")

module.exports = (env, argv) => {
    const mode = (argv || {}).mode || "production"
    const isDevMode = mode === "development"

    const fakeAdviceEnv = require("./buildLib/forceFakeAdvice")(isDevMode)

    const res = {
        cache: false,
        mode: mode,
        entry: {
            app: "./src/js/app.js",
        },
        target: "web",
        resolve: {
            alias: {
                "@/lib/adviceProvider": path.resolve(
                    __dirname,
                    fakeAdviceEnv.FAKE_ADVICE
                        ? "src/js/lib/adviceProviderWithFaker"
                        : "src/js/lib/adviceProvider"
                ),
                "@": path.resolve(__dirname, "src/js/"),
            },
            extensions: [".vue", ".json", ".js", ".jsx"],
            fallback: {
                os: false,
                fs: false,
                path: false,
            },
        },
        devtool: isDevMode
            ? "inline-source-map"
            : "hidden-nosources-source-map",
        // devtool: "hidden-cheap-source-map",
        devServer: {
            static: {
                directory: "./public",
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\.vue$/,
                    use: "vue-loader",
                },
                {
                    test: /\.([sp])?css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 'style-loader', // inline-css
                        "css-loader",
                        "postcss-loader",
                        "resolve-url-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: isDevMode
                            ? "assets/images/[name][ext]"
                            : "assets/images/[name]-[hash][ext]",
                    },
                },
                {
                    test: /\.(woff2|woff|eot|ttf|otf)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: isDevMode
                            ? "assets/fonts/[name][ext]"
                            : "assets/fonts/[name]-[hash][ext]",
                    },
                },
            ],
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                title: "Frontend Mentor | Advice generator app",
                template: "./src/index.ejs",
                templateParameters: {
                    ...appData,
                    build_time: strftime("%Y/%m/%d %H:%M:%S"),
                },
            }),
            new MiniCssExtractPlugin({
                filename: isDevMode
                    ? "css/[name].css"
                    : "css/[name]-[fullhash].css",
            }),
            new ESLintPlugin({
                extensions: ["js", "jsx", "vue"],
            }),
            new DefinePlugin({
                // Drop Options API from bundle
                "__VUE_PROD_DEVTOOLS__": isDevMode,
                "__VUE_OPTIONS_API__": isDevMode,
                "__BUILD_TIME__": JSON.stringify(strftime("%Y/%m/%d %H:%M:%S")),
                "__APP_DATA__": JSON.stringify(appData),
                "process.env": JSON.stringify(fakeAdviceEnv),
            }),
        ],
        optimization: {
            runtimeChunk: isDevMode ? "single" : false,
        },
        output: {
            filename: "js/[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            clean: true,
        },
    }

    if (parseInt(env["OPEN_ANALYZE"])) {
        res.plugins.push(new BundleAnalyzerPlugin())
    }

    return res
}
