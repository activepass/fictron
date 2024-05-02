export const enum IpcEvents {
    GET_MIN_FIC = 'GET_MIN_FIC',
    GET_AO3_FIC = 'GET_AO3_FIC',
    GET_FFNET_FIC = 'GET_FFNET_FIC',

    GET_LIBRARY = 'GET_LIBRARY',
    GET_LIBRARY_RECENT = 'GET_LIBRARY_RECENT',

    GET_AO3_FIC_CONTENT = 'GET_AO3_FIC_CONTENT',
    ADD_AO3_FIC_TO_LIBRARY = 'ADD_AO3_FIC_TO_LIBRARY',
    GET_AO3_FIC_URL = 'GET_AO3_FIC_URL',
    LINK_AO3_FIC = 'LINK_AO3_FIC',

    GET_FFNET_FIC_CONTENT = 'GET_FFNET_FIC_CONTENT',
    ADD_FFNET_FIC_TO_LIBRARY = 'ADD_FFNET_FIC_TO_LIBRARY',
    GET_FFNET_FIC_URL = 'GET_FFNET_FIC_URL',
    LINK_FFNET_FIC = 'LINK_FFNET_FIC',

    CHAPTER_AO3 = 'CHAPTER_AO3',
    CHAPTER_FFNET = 'CHAPTER_FFNET',

    CAPTCHA_SOLVED = 'CAPTCHA_SOLVED',
    CAPTCHA_SHOW_WINDOW = 'CAPTCHA_SHOW_WINDOW',
}