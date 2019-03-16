// transform figma document into theme object

module.exports = (data = {}) => {


    function getPalette(stylesArtboard) {
        // empty "palette obj" wheree we will store all colors
        const palette = {};
        // get "palette" artboard
        const paletteAtrboard = stylesArtboard.filter(item => {
            return item.name === "palette";
    })[0].children;

        // get colors from each children
        paletteAtrboard.map(item => {
            function rbaObj(obj) {
            return item.fills[0].color[obj] * 255;
        }

        const colorObj = {
            [item.name]: {
                value: `rgba(${rbaObj("r")}, ${rbaObj("g")}, ${rbaObj("b")}, ${
                    item.fills[0].color.a
                    })`,
                type: "color"
            }
        };

        Object.assign(palette, colorObj);
    });

        return palette;
    }

    function getGrids(stylesArtboard) {
        // empty "grids obj" wheree we will store all colors
        const grids = {};
        // get "grids" artboard
        const gridsAtrboard = stylesArtboard.filter(item => {
            return item.name === "grids";
    })[0].children;

        gridsAtrboard.map(item => {
            const gridObj = {
                [item.name]: {
                    count: {
                        value: item.layoutGrids[0].count,
                        type: "grids"
                    },
                    gutter: {
                        value: `${item.layoutGrids[0].gutterSize}px`,
                        type: "grids"
                    },
                    offset: {
                        value: `${item.layoutGrids[0].offset}px`,
                        type: "grids"
                    },
                    width: {
                        value: `${item.absoluteBoundingBox.width}px`,
                        type: "grids"
                    }
                }
            };

        Object.assign(grids, gridObj);
    });

        return grids;
    }

    function getSpacers(stylesArtboard) {
        // empty "spacers obj" wheree we will store all colors
        const spacers = {};
        // get "spacers" artboard
        const spacersAtrboard = stylesArtboard.filter(item => {
            return item.name === "spacers";
    })[0].children;

        spacersAtrboard.map(item => {
            const spacerObj = {
                [item.name]: {
                    value: `${item.absoluteBoundingBox.height}px`,
                    type: "spacers"
                }
            };

        Object.assign(spacers, spacerObj);
    });

        return spacers;
    }

    function getFontStyles(stylesArtboard) {
        // empty "spacers obj" wheree we will store all colors
        const fontStyles = {};
        // get "spacers" artboard
        const fontStylesAtrboard = stylesArtboard.filter(item => {
            return item.name === "typography";
    })[0].children;

        fontStylesAtrboard.map((fontItem, i) => {
            if (fontItem.children) {
            let subFonts = {};

            // get all sub fonts
            fontItem.children.map(subFontItem => {
                let subFontObj = {
                    [subFontItem.name]: {
                        family: {
                            value: `${subFontItem.style.fontFamily}`,
                            type: "typography"
                        },
                        size: {
                            value: `${subFontItem.style.fontSize}px`,
                            type: "typography"
                        },
                        weight: {
                            value: subFontItem.style.fontWeight,
                            type: "typography"
                        },
                        lineheight: {
                            value: `${subFontItem.style.lineHeightPercent}%`,
                            type: "typography"
                        },
                        spacing: {
                            value:
                                subFontItem.style.letterSpacing !== 0
                                    ? `${subFontItem.style.letterSpacing}px`
                                    : "normal",
                            type: "typography"
                        }
                    }
                };
            // merge multiple subfonts objects into one
            Object.assign(subFonts, subFontObj);
        });

            //
            let fontObj = {
                [fontItem.name]: subFonts
            };

            Object.assign(fontStyles, fontObj);
        } else {
            let fontObj = {
                [fontItem.name]: {
                    family: {
                        value: `${fontItem.style.fontFamily}, ${
                            fontItem.style.fontPostScriptName
                            }`,
                        type: "typography"
                    },
                    size: {
                        value: fontItem.style.fontSize,
                        type: "typography"
                    },
                    weight: {
                        value: fontItem.style.fontWeight,
                        type: "typography"
                    },
                    lineheight: {
                        value: `${fontItem.style.lineHeightPercent}%`,
                        type: "typography"
                    },
                    spacing: {
                        value:
                            fontItem.style.letterSpacing !== 0
                                ? `${fontItem.style.letterSpacing}px`
                                : "normal",
                        type: "typography"
                    }
                }
            };

            Object.assign(fontStyles, fontObj);
        }
    });

        return fontStyles;
    }

    const stylesArtboard = data.document.children.filter(item => {
        return item.name === "styles";
    })[0].children;


    let baseTokeensJSON = {
        token: {
            grids: {},
            spacers: {},
            colors: {},
            fonts: {}
        }
    };

    // Object.assign(baseTokeensJSON.token.grids, getGrids(stylesArtboard));
    Object.assign(baseTokeensJSON.token.spacers, getSpacers(stylesArtboard));
    Object.assign(baseTokeensJSON.token.colors, getPalette(stylesArtboard));
    Object.assign(baseTokeensJSON.token.fonts, getFontStyles(stylesArtboard));


    return baseTokeensJSON
}
