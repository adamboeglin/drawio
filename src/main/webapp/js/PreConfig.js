/**
 * Copyright (c) 2006-2020, JGraph Ltd
 * Copyright (c) 2006-2020, draw.io AG
 */
// Overrides of global vars need to be pre-loaded
window.EXPORT_URL = 'https://azurediagrams.azureedge.net';
window.PLANT_URL = 'https://azurediagrams.azureedge.net';
window.DRAWIO_BASE_URL = 'https://azurediagrams.azureedge.net'; // Replace with path to base of deployment, e.g. https://www.example.com/folder
window.DRAWIO_VIEWER_URL = 'https://azurediagrams.azureedge.net/js/viewer.min.js'; // Replace your path to the viewer js, e.g. https://www.example.com/js/viewer.min.js
window.DRAW_MATH_URL = 'math';
window.DRAWIO_CONFIG = {"css": ".geMenubarContainer { background-color: #000000 !important; } \
                                .geMenubarContainer a { color: #fff !important; } \
                                .geMenubar { background-color: #000000 !important; } \
                                .geEditor { font-family: 'Segoe UI', Arial, Helvetica, sans-serif !important; } \
                                .geSidebarFooter a { color: #0078d4 !important;} \
                                .geMenubarContainer .geItem:hover { background: #31313b !important; border-radius: 1px; }",
                        "defaultFonts": [
                            "Segoe UI",
                            "Helvetica",
                            "Arial",
                            "Verdana",
                            "Tahoma"
                            ],
                        "defaultVertexStyle": {
                            "fontFamily": "Segoe UI",
                            "fontSize": "12",
                            "labelBackgroundColor": "none",
                            "html": "1",
                            "fontColor": "#525252",
                            "align": "center"
                        },
                        "libraries": [ {
                            "title": {
                            "main": "Azure Diagrams"
                            },
                            "entries": [ {
                           "id": "azure-diagram-graphics",
                           "title": {
                             "main": "Diagram Graphics"
                            },
                           "desc": {
                             "main": "Collection of supporting graphics for Azure Diagrams"
                           },
                           "libs": [ {
                            "title": {
                              "main": "Azure Diagram Components"
                            },
                            "data": [ {
                                "xml": "jVLtasMwDHwa/0+d7QGa9IPBBoOyB/ASNRGVo+C4XbKnn5y4aVMojBCw7nRncbJKc9vvnWnrDy6BVLpVae6Y/XSyfQ5ESidYqnSjtE7kV3r3hF2NbNIaB43/j0BPgouhMywsOj9QRESBbSdFZroWiuB7xB7EIeu84xPkTOwEbbgJXWS+gTJTnCrH56Z8YI9IdIWUTtev+TZJAs6Nv8PTJHwR3xmLNAhxgIpBpvt6E+YCzmNhaE1YNUJaLEuaB/jkDj1yIAoJA9yd4v2hYVaaaDUrwu0H/A1JrLTUtbeyo00YLCYnltA/TX+EYvR7YAveDdLyg6Wv4wZeJlUNWNV+iZluqqtZeVulHOI2r+Xt1Yzc4lH9AQ==",
                                "aspect": "fixed"
                              },
                              {
                                "xml": "jVLbaoNAEP2afSyYlQp9rNqEQgqFtB+w1cm6ZHSsbm79+s5eNGkgUBdxPefMzJlhRFq0p9Wg+uaNakCRvoi0GIhsuLWnAhCFTEwt0lJImfAr5PIOu/Bs0qsBOvufABkCDgr3EBAhM+TQfEucQSYVIQ2eyb73zlUuZPoo3bmGMu2+q4H2/ZSAi4YcgQuFRnvGWIi1XQ3OR8L0sTEWNr2qHHvkeTDW2JYHUi74qlGNY5Si+gLMVbXTPkURHXbUQfS9VK3BM2Mb0ARc9vM1Mhvz4wosZPwv5vbSxD+MKzS6Ywxha6dy7zQaa8jBFY8WOCY/wGBNpXB9I2hNXbsmZ8FzTGjJdTVyk6bTOVlLbWwpYh9OUD7IR+fOIF65W/rjpHagHdw0HePX3nEp53E7B3C6uxseiouxAmrBDmeWHE1tm6jInkJYA0Y3U1galipRYwD0HHtZNb7EbZt+L1vtuT9L/ws=",
                                "aspect": "fixed"
                              },
                              {
                                "xml": "jZHBbsMgEES/hjuBHtqrnTrqIVKlqB9A441BwayFN7X9910DbtRKkSrL0vrNDOBB6LqfD9EM9ogteKFfha4jIuWpn2vwXijpWqH3QinJr1DNA3WXVDmYCIH+E1A58GX8DTLJYKTFFxDxFlpY/VLoarKO4DSY86pOfG5mlno++H7Hozef4CtzvnYpVqPHyFLAwP7qgoEa0zu/MDtBh8Bbfbyx0prRpj3WRS7O+z/JVX83RBBDMin5xHSkiFfYrELpl2Z9WCm/BZFgflhNQqWXA2APFBe2TK4lWxwy1yctuM5usecCzZhB95O9N81DKXv7vF9q0n7d+Tc=",
                                "aspect": "fixed"
                              },
                              {
                                "xml": "jZLPboMwDMafJveQaNp6ha7VDlsPaA+QEpdkzR8U3AF7+hlI1+1QaUJI9vfzF2IbJis/7pPqzGvU4Jh8ZrJKMeIa+bEC55jgVjO5ZUJwepnY3aHFQnmnEgT8j0Gshk/lLrAqb8qDJulw/IAGV9zj5DJO8RI0zG7OZDkYi1B3qpnpQF2QZtBTG9uCQqeO4ErVnNvFVkUXE6EQA9WXPaZ4hqvIhCz440k/ETnFgDvlrZsI1NBGoEu8v2RS26/5c4WgXDnbBkoa6hfomFKr3izXK3L1r/MfxPyQnpuGhDDeHdwi5antIXrANFHJYDWaXJGHyw3Y1mTbJmuqX/P2x3pbAwV5E9f0tvGF/fkhvgE=",
                                "aspect": "fixed"
                              },
                              {
                                "xml": "jVLNasMwDH4a3xNnsF2XdC2FDgZhD+DGamxqR8FRm2RPPyVxVjpW2MEgfT+yJVlkhR92QbXmHTU4kb2JrAiItER+KMA5IROrRbYRUiZ8hNw+YNOZTVoVoKH/GORiuCp3gQU5qCM40AzuAl7ahe9odJFnsNEw2ROR5b2xBGWrqontuQ3GDHnuY5Ny6KZiuarO9Wwr0GFgqsGG9fkJG9oqb93IWAk1Al/1uY9Mab+moqnkXDlbN5xU3BZwhbyjgGdY6wmZpcnzSb9E61/4FQLZSrnXWIqwXR/4gZ0li3cXrPLDL8ERidCzIA6OZTA8HP4MxcnvAD1QGFnSW00mKuKCEgO2NqvtKYKqW4D6x3vbJQdxnWt6+zYzd/ervgE=",
                                "aspect": "fixed"
                              },
                            ]
                             } ]
                            } ]
                           } ],
                        "defaultEdgeStyle": {
                            "fontFamily": "Segoe UI",
                            "fontSize": "12",
                            "strokeColor": "#959595",
                            "edgeStyle": "orthogonalEdgeStyle",
                            "rounded": "0",
                            "jettySize": "auto",
                            "orthogonalLoop": "1",
                            "targetPerimeterSpacing": "20",
                            "sourcePerimeterSpacing": "20",
                            "strokeWidth": "2",
                            "endArrow": "block",
                            "endFill": "1",
                            "html": "1",
                            "verticalAlign": "bottom",
                            "align": "center"
                        },
                        "defaultLibraries": "azure-diagram-graphics",
                        "defaultCustomLibraries": [],
                        "defaultMacroParameters": {
                            "border": false,
                            "toolbarStyle": "inline"
                        },
                        "ui": "kennedy",
                        "plugins": ['./plugins/azure-diagrams.js',
                              './plugins/azure-sidebar.js'],
                        "pv": false,
                        "local": "1",
                        "db": "0",
                        "compressXml": false,
                        "showStartScreen": false,
                        "thumbWidth": 46,
                        "thumbHeight": 46,
                        "emptyDiagramXml": "<mxGraphModel dx='1540' dy='637' grid='1' gridSize='10' guides='1' tooltips='1' connect='1' arrows='1' fold='1' page='1' pageScale='1' pageWidth='800' pageHeight='450' background='#FFFFFF' math='0' shadow='0'><root></root></mxGraphModel>",
                        "templateFile": "/azure-template.xml",
                        "fontCss": "@font-face {\
                            font-family: SegoeUI;\
                            src:\
                                local('Segoe UI'),\
                                url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2) format('woff2'),\
                                url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff) format('woff'),\
                                url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf) format('truetype');\
                            font-weight: 400;\
                        }",
                        "emptyLibraryXml": "<mxlibrary>[]</mxlibrary>",
                        "defaultEdgeLength": 80,
                        "version": 8
            }; // Replace with your custom draw.io configurations. For more details, https://desk.draw.io/support/solutions/articles/16000058316
urlParams['sync'] = 'manual';
urlParams['od'] = '0';
urlParams['gapi'] = '0';