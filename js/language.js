// js/langua.js - 多语言功能模块

// 多语言文本配置
const translations = {
    zh: {
        nav: {
            home: '首页',
            cases: '案例作品',
            service: '作品展示',
            about: '关于我们',
            contact: '联系我们'
        },
        logo: {
            title: '咬哒叔',
            subtitle: 'SPINE 2D STUDIO'
        },
        banner: {
            available: 'AVAILABLE FOR PROJECTS',
            title1: '专业游戏',
            title2: 'Spine动画',
            title3: '制作服务',
            description: '七年专注2D骨骼动画，为独立游戏与商业项目提供高品质角色动画、特效设计与技术集成方案。从概念设计到引擎落地，全流程专业服务。',
            btn1: '查看作品案例',
            btn2: '联系我们',
            yearNum: '7年',
            projects: '完成项目',
            experience: '行业经验',
            delivery: '如期交付',
            scroll: '向下继续浏览',
            dragTip: '点住拖拽她！',
            jsonExport: 'JSON导出',
            optimize: '极限优化',
            physics: '物理模拟'
        },
        services: {
            title: '服务项目',
            subtitle: '从角色切图到引擎集成，提供完整的技术支持。熟悉Unity、Cocos Creator、Unreal Engine、Godot等主流引擎的Spine运行时集成。',
            gameAction: {
                title: '游戏动作',
                description: '专业的骨骼绑定、权重绘制与动作设计。包含待机动画、战斗、手机反馈、表情动画等全套角色动画。'
            },
            interactive: {
                title: '交互动效',
                description: '赋予视觉灵魂，用细腻的动态反馈连接用户与产品。'
            },
            film: {
                title: '影视动画',
                description: '精于角色表演细节，为不同性格的角色注入独特生命力。'
            }
        }
    },
    en: {
        nav: {
            home: 'Home',
            cases: 'Portfolio',
            service: 'Works',
            about: 'About',
            contact: 'Contact'
        },
        logo: {
            title: 'Yaoda Shu',
            subtitle: 'SPINE 2D STUDIO'
        },
        banner: {
            available: 'AVAILABLE FOR PROJECTS',
            title1: 'Professional Game',
            title2: 'Spine Animation',
            title3: 'Production Services',
            description: 'Seven years focused on 2D skeletal animation, providing high-quality character animation, special effects design and technical integration solutions for indie games and commercial projects. From concept design to engine implementation, full-process professional services.',
            btn1: 'View Portfolio',
            btn2: 'Contact Us',
            yearNum: '7Year',
            projects: 'Projects',
            experience: 'Experience',
            delivery: 'On-time Delivery',
            scroll: 'Scroll Down',
            dragTip: 'Click and drag her around!',
            jsonExport: 'JSON Export',
            optimize: 'Extreme Optimization',
            physics: 'Physics Simulation'
        },
        services: {
            title: 'SERVICES',
            subtitle: 'From character slicing to engine integration, providing complete technical support. Familiar with Spine runtime integration for mainstream engines like Unity, Cocos Creator, Unreal Engine, Godot, etc.',
            gameAction: {
                title: 'Game Animation',
                description: 'Professional skeletal binding, weight painting and motion design. Including idle animations, combat, mobile feedback, facial expressions and other complete character animations.'
            },
            interactive: {
                title: 'Interactive Effects',
                description: 'Giving visual soul to products, connecting users and products with delicate dynamic feedback.'
            },
            film: {
                title: 'Film Animation',
                description: 'Expert in character performance details, injecting unique vitality into characters with different personalities.'
            }
        }
    }
};

// 获取当前语言或设置默认语言
let currentLanguage = localStorage.getItem('language') || 'zh';

// 更新页面文本的函数
function updatePageLanguage(lang) {
    const trans = translations[lang];
    if (!trans) return;

    // 同步更新页面语言声明
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    // 更新导航链接
    const navLinks = document.querySelectorAll('.nav-links a');
    const navKeys = ['home', 'cases', 'service', 'about', 'contact'];
    navLinks.forEach((link, index) => {
        if (navKeys[index] && trans.nav[navKeys[index]]) {
            link.textContent = trans.nav[navKeys[index]];
        }
    });

    // 更新Logo文字
    const logoTitle = document.querySelector('.logo-text h1');
    const logoSubtitle = document.querySelector('.logo-text p');
    if (logoTitle && trans.logo.title) logoTitle.textContent = trans.logo.title;
    if (logoSubtitle && trans.logo.subtitle) logoSubtitle.textContent = trans.logo.subtitle;

    // 更新语言按钮显示
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = lang === 'zh' ? '中' : 'EN';
    }

    // 更新语言选项的激活状态
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });

    // 更新所有带有data-i18n属性的元素
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (key && getNestedValue(trans, key)) {
            element.textContent = getNestedValue(trans, key);
        }
    });
}

// 辅助函数：获取嵌套对象的值
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// 初始化语言切换功能
function initLanguageSwitcher() {
    // 语言切换功能
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedLang = option.getAttribute('data-lang');
            if (selectedLang && selectedLang !== currentLanguage) {
                currentLanguage = selectedLang;
                localStorage.setItem('language', currentLanguage);
                updatePageLanguage(currentLanguage);
            }
        });
    });

    // 初始化页面语言
    updatePageLanguage(currentLanguage);
}

// 导出函数供其他模块使用
window.language = {
    updatePageLanguage,
    initLanguageSwitcher,
    getCurrentLanguage: () => currentLanguage,
    setLanguage: (lang) => {
        if (translations[lang]) {
            currentLanguage = lang;
            localStorage.setItem('language', currentLanguage);
            updatePageLanguage(currentLanguage);
        }
    }
};

// 当DOM加载完成后自动初始化
document.addEventListener('DOMContentLoaded', () => {
    // 使用setTimeout确保layout.js已经执行完毕
    setTimeout(() => {
        if (document.querySelector('.language-selector')) {
            initLanguageSwitcher();
        } else {
            // 如果还没有加载完成，等待layoutLoaded事件
            document.addEventListener('layoutLoaded', initLanguageSwitcher);
        }
    }, 100);
});
