interface MenuItems {
    title: string;
    icon: string;
    link: string;
}

export const MENU_ITEMS: MenuItems[] = [
    {
        title: '好友',
        icon: 'person',
        link: '/pages/friends'
    },
    {
        title: '聊天',
        icon: 'sms',
        link: '/pages/chats'
    },
    {
        title: '設定',
        icon: 'settings-page',
        link: '/pages/settings-page'
    }
]