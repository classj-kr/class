(function (global) {
    'use strict';

    const EMPTY_AVATAR = Object.freeze({ name: '', icon: '' });
    const EMPTY_LIST = Object.freeze([]);

    function getAvatarForStudent() {
        return EMPTY_AVATAR;
    }

    function getAvatarForStudentRecord(student) {
        const avatarUrl = String(student?.avatarUrl || '');
        if (/^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i.test(avatarUrl)) {
            return {
                name: String(student?.avatarKey || 'assigned-avatar'),
                icon: `<img src="${avatarUrl}" alt="" class="assigned-avatar-image" style="width:1.5em;height:1.5em;object-fit:contain;vertical-align:middle;">`
            };
        }
        return EMPTY_AVATAR;
    }

    function getOrder() {
        return EMPTY_LIST;
    }

    global.ClassroomAvatars = Object.freeze({
        avatars: EMPTY_LIST,
        getAvatarForStudent,
        getAvatarForStudentRecord,
        getOrder
    });
})(window);