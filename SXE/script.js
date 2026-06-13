// Space X Explorer - 核心功能脚本
(function() {
    'use strict';

    // 实时新闻数据源 - 使用多个公共API作为数据源
    const NEWS_SOURCES = [
        {
            name: 'SpaceX 官方更新',
            url: 'https://api.spacexdata.com/v4/launches/upcoming',
            type: 'spacex-api'
        },
        {
            name: '航天新闻',
            url: 'https://api.spaceflightnewsapi.net/v4/articles',
            type: 'news-api'
        }
    ];

    // 静态备用新闻数据（当API不可用时使用）
    const FALLBACK_NEWS = [
        {
            title: 'SpaceX 成功完成星舰第七次综合飞行测试',
            summary: 'Starship在最新测试中成功完成了推进剂转移和多项轨道操作，进一步验证了可重复使用火箭技术的可行性。',
            image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80',
            date: '2026-06-10'
        },
        {
            title: 'Falcon Heavy 成功发射欧洲航天局探测器',
            summary: '这枚世界现役运力最强的火箭将新一代科学探测器送入深空，开启了人类探索太阳系的新篇章。',
            image: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&w=800&q=80',
            date: '2026-06-08'
        },
        {
            title: 'Starlink 卫星网络全球覆盖用户突破千万',
            summary: 'SpaceX宣布Starlink卫星互联网服务全球用户数突破1000万，为偏远地区提供高速互联网接入。',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
            date: '2026-06-05'
        },
        {
            title: 'Crew Dragon 成功完成国际空间站对接',
            summary: '载人龙飞船成功将四名宇航员运送至国际空间站，开启了为期六个月的科学研究任务。',
            image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
            date: '2026-06-02'
        },
        {
            title: 'SpaceX 披露火星殖民计划最新进展',
            summary: '埃隆·马斯克公布了SpaceX火星殖民计划的最新时间表，预计2030年前实现首批人类登陆火星。',
            image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
            date: '2026-05-30'
        },
        {
            title: '可重复使用火箭技术再获突破',
            summary: 'Falcon 9一级助推器成功完成第25次回收，创造了可重复使用火箭的新纪录。',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
            date: '2026-05-25'
        }
    ];

    // 发射任务数据
    const LAUNCHES_DATA = [
        {
            name: 'STARLINK MISSION',
            rocket: 'Falcon 9',
            location: '佛罗里达州肯尼迪航天中心',
            date: '2026-06-15',
            time: '14:30:00',
            status: 'upcoming'
        },
        {
            name: 'NASA CREW-12',
            rocket: 'Falcon 9',
            location: '佛罗里达州肯尼迪航天中心',
            date: '2026-07-01',
            time: '10:00:00',
            status: 'upcoming'
        },
        {
            name: 'JUPITER PROBE',
            rocket: 'Falcon Heavy',
            location: '佛罗里达州肯尼迪航天中心',
            date: '2026-08-15',
            time: '02:00:00',
            status: 'upcoming'
        },
        {
            name: 'STARSHIP IFT-8',
            rocket: 'Starship',
            location: '得克萨斯州博卡奇卡',
            date: '2026-05-20',
            time: '12:00:00',
            status: 'completed'
        },
        {
            name: 'STARLINK MISSION',
            rocket: 'Falcon 9',
            location: '加利福尼亚州范登堡空军基地',
            date: '2026-05-10',
            time: '20:00:00',
            status: 'completed'
        }
    ];

    // 火箭数据
    const ROCKETS_DATA = {
        falcon9: {
            name: 'FALCON 9',
            tagline: '世界首款可重复使用的轨道级火箭',
            height: '70 m',
            diameter: '3.7 m',
            mass: '549,054 kg',
            leoCapacity: '22,800 kg',
            stages: '2',
            engines: '9 x Merlin',
            description: 'Falcon 9是由Space X设计和制造的两级可重复使用火箭，旨在将宇航员和货物安全可靠地运送到地球轨道及更远的地方。作为世界首款轨道级可重复使用火箭，Falcon 9能够实现火箭主要部件的回收和重用，大幅降低了太空发射成本。'
        },
        falconheavy: {
            name: 'FALCON HEAVY',
            tagline: '世界现役运力最强火箭',
            height: '70 m',
            diameter: '12.2 m',
            mass: '1,420,788 kg',
            leoCapacity: '63,800 kg',
            stages: '2',
            engines: '27 x Merlin',
            description: 'Falcon Heavy由三个Falcon 9一级助推器组成，27台Merlin发动机在起飞时产生超过500万磅的推力，能够将重型货物和有效载荷送入轨道。它保持着现役火箭中运力最强的纪录。'
        },
        starship: {
            name: 'STARSHIP',
            tagline: '下一代全可重复使用超重型运载火箭',
            height: '120 m',
            diameter: '9 m',
            mass: '5,000,000 kg',
            leoCapacity: '100,000+ kg',
            stages: '2',
            engines: '33 x Raptor',
            description: 'Starship是SpaceX正在开发的下一代超重型运载火箭，由超级重型助推器和星ship飞船组成。它旨在成为世界上运力最强的火箭，并最终实现载人登陆火星的目标。Starship采用全不锈钢结构，使用甲烷和液氧作为推进剂，设计目标是完全可重复使用。'
        },
        dragon: {
            name: 'DRAGON',
            tagline: '载人货运飞船',
            height: '8.1 m',
            diameter: '3.7 m',
            mass: '9,525 kg',
            leoCapacity: '6,000 kg',
            stages: '1',
            engines: '16 x Draco',
            description: 'Dragon飞船是SpaceX开发的载人货运飞船，用于向国际空间站运送人员和货物。它是目前唯一能够将宇航员从国际空间站送回地球的商业载人飞船。Dragon飞船采用先进的生命支持系统，能够容纳最多7名宇航员。'
        }
    };

    // 部件组装数据
    const ROCKET_PARTS = [
        { id: 'payload', name: '有效载荷', icon: '🛰️' },
        { id: 'fairing', name: '整流罩', icon: '📐' },
        { id: 'secondStage', name: '二级箭体', icon: '🔥' },
        { id: 'interstage', name: '级间段', icon: '⚙️' },
        { id: 'firstStage', name: '一级箭体', icon: '🚀' },
        { id: 'landingLegs', name: '着陆支架', icon: '🦶' }
    ];

    // 全局状态
    const state = {
        assembledParts: {},
        isLaunching: false,
        nextLaunchTime: null,
        countdownInterval: null
    };

    // DOM 引用缓存
    const $ = (id) => document.getElementById(id);

    // 初始化应用
    function init() {
        setupNavigation();
        setupMobileMenu();
        loadNews();
        loadLaunches();
        setupRocketSelection();
        setupAssembly();
        startMainCountdown();
        setupKeyboardShortcuts();
    }

    // 导航设置
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const section = this.dataset.section;
                switchSection(section);
                // 关闭移动菜单
                const mobileMenu = $('mobileMenu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            });
        });
    }

    // 切换页面
    function switchSection(sectionId) {
        // 更新导航链接
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // 更新移动导航
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });

        // 切换内容区域
        document.querySelectorAll('.section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 移动端菜单
    function setupMobileMenu() {
        const hamburger = $('hamburger');
        const mobileMenu = $('mobileMenu');
        
        if (hamburger && mobileMenu) {
            hamburger.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
            });
        }
    }

    // 加载新闻
    async function loadNews() {
        const newsGrid = $('newsGrid');
        if (!newsGrid) return;

        // 显示加载状态
        newsGrid.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1 / -1;"><span class="loading-spinner"></span> <span style="margin-left: 15px; letter-spacing: 2px; font-size: 14px;">加载最新资讯...</span></div>';

        try {
            // 尝试从API获取数据
            let newsData = await fetchNewsFromAPI();
            
            // 如果API不可用，使用备用数据
            if (!newsData || newsData.length === 0) {
                newsData = FALLBACK_NEWS;
            }

            // 渲染新闻
            renderNews(newsData);
        } catch (error) {
            console.error('加载新闻失败:', error);
            renderNews(FALLBACK_NEWS);
        }
    }

    // 从API获取新闻
    async function fetchNewsFromAPI() {
        try {
            // 尝试使用 spaceflightnewsapi
            const response = await fetch('https://api.spaceflightnewsapi.net/v4/articles?limit=6');
            if (!response.ok) throw new Error('API请求失败');
            
            const data = await response.json();
            
            if (data && Array.isArray(data.results) && data.results.length > 0) {
                return data.results.map(item => ({
                    title: item.title,
                    summary: item.summary || item.title,
                    image: item.image_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
                    date: new Date(item.published_at).toISOString().split('T')[0]
                }));
            }
        } catch (error) {
            console.warn('无法从API获取新闻，使用备用数据');
        }
        return null;
    }

    // 渲染新闻列表
    function renderNews(newsItems) {
        const newsGrid = $('newsGrid');
        if (!newsGrid) return;

        // 创建淡入动画效果
        newsGrid.innerHTML = '';
        
        newsItems.slice(0, 6).forEach((item, index) => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-item fade-in';
            newsCard.style.animationDelay = `${index * 0.1}s`;
            
            newsCard.innerHTML = `
                <div class="news-item-image" style="background-image: url('${item.image}'); background-size: cover; background-position: center;"></div>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <span class="news-date">${item.date}</span>
            `;
            
            newsGrid.appendChild(newsCard);
        });
    }

    // 刷新新闻
    function refreshNews() {
        loadNews();
    }

    // 加载发射任务
    function loadLaunches() {
        const launchesGrid = $('launchesGrid');
        if (!launchesGrid) return;

        launchesGrid.innerHTML = '';
        
        LAUNCHES_DATA.forEach((launch, index) => {
            const launchItem = document.createElement('div');
            launchItem.className = 'launch-item fade-in';
            launchItem.style.animationDelay = `${index * 0.1}s`;
            
            const dateObj = new Date(launch.date);
            const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            
            launchItem.innerHTML = `
                <div class="launch-date">
                    <span class="date-day">${dateObj.getDate()}</span>
                    <span class="date-month">${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}</span>
                </div>
                <div class="launch-details">
                    <h3>${launch.name}</h3>
                    <p>${launch.rocket} · ${launch.location}</p>
                </div>
                <span class="launch-status-tag ${launch.status}">${launch.status === 'upcoming' ? '即将发射' : '已完成'}</span>
            `;
            
            launchesGrid.appendChild(launchItem);
        });
    }

    // 设置下一次发射倒计时
    function startMainCountdown() {
        const nextLaunch = LAUNCHES_DATA.find(l => l.status === 'upcoming');
        if (!nextLaunch) return;

        // 解析发射时间
        const launchDateTime = new Date(`${nextLaunch.date}T${nextLaunch.time}`);
        state.nextLaunchTime = launchDateTime;

        // 更新显示信息
        const launchName = $('nextLaunchName');
        const launchRocket = $('nextLaunchRocket');
        
        if (launchName) launchName.textContent = nextLaunch.name;
        if (launchRocket) launchRocket.textContent = `${nextLaunch.rocket} · ${nextLaunch.location}`;

        // 启动倒计时
        updateCountdown();
        state.countdownInterval = setInterval(updateCountdown, 1000);
    }

    // 更新倒计时显示
    function updateCountdown() {
        const daysEl = $('days');
        const hoursEl = $('hours');
        const minutesEl = $('minutes');
        const secondsEl = $('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const now = new Date().getTime();
        const distance = state.nextLaunchTime.getTime() - now;

        if (distance < 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // 火箭选择功能
    function setupRocketSelection() {
        const rocketCards = document.querySelectorAll('.rocket-card');
        rocketCards.forEach(card => {
            card.addEventListener('click', function() {
                const rocketType = Array.from(this.classList).find(cls => cls !== 'rocket-card');
                if (ROCKETS_DATA[rocketType] || this.dataset.rocket) {
                    selectRocket(this.dataset.rocket || rocketType);
                }
            });
        });

        // 确保卡片有正确的data属性
        document.querySelectorAll('.rocket-card').forEach((card, index) => {
            const rocketKeys = ['falcon9', 'falconheavy', 'starship', 'dragon'];
            if (!card.dataset.rocket && rocketKeys[index]) {
                card.dataset.rocket = rocketKeys[index];
            }
        });
    }

    // 选择火箭并更新详情
    function selectRocket(rocketType) {
        const rocket = ROCKETS_DATA[rocketType];
        if (!rocket) return;

        const detailSection = document.querySelector('.rocket-detail-content');
        if (!detailSection) return;

        detailSection.innerHTML = `
            <h2>${rocket.name}</h2>
            <p class="rocket-tagline">${rocket.tagline}</p>
            <div class="specs-grid">
                <div class="spec-item">
                    <span class="spec-label">高度</span>
                    <span class="spec-value">${rocket.height}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">直径</span>
                    <span class="spec-value">${rocket.diameter}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">质量</span>
                    <span class="spec-value">${rocket.mass}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">LEO运力</span>
                    <span class="spec-value">${rocket.leoCapacity}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">级数</span>
                    <span class="spec-value">${rocket.stages}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">发动机</span>
                    <span class="spec-value">${rocket.engines}</span>
                </div>
            </div>
            <p class="rocket-description">${rocket.description}</p>
        `;

        // 平滑滚动到详情
        document.querySelector('.rocket-detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 设置组装功能
    function setupAssembly() {
        const partItems = document.querySelectorAll('.part-item');
        const assemblySlots = document.querySelectorAll('.assembly-slot');

        // 为部件添加拖拽事件
        partItems.forEach(item => {
            item.setAttribute('draggable', 'true');
            
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('partType', this.dataset.part);
                this.classList.add('dragging');
            });

            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });

            // 移动端支持：点击选择
            item.addEventListener('click', function() {
                const partType = this.dataset.part;
                const targetSlot = document.querySelector(`.assembly-slot[data-slot="${partType}"]:not(.filled)`);
                if (targetSlot) {
                    fillSlot(targetSlot, partType);
                }
            });
        });

        // 为插槽添加拖放事件
        assemblySlots.forEach(slot => {
            slot.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });

            slot.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                const partType = e.dataTransfer.getData('partType');
                const slotType = this.dataset.slot;
                
                if (partType === slotType && !this.classList.contains('filled')) {
                    fillSlot(this, partType);
                }
            });
        });
    }

    // 填充插槽
    function fillSlot(slot, partType) {
        const part = ROCKET_PARTS.find(p => p.id === partType);
        if (!part) return;

        slot.classList.add('filled');
        slot.innerHTML = `<span style="font-size: 28px;">${part.icon}</span>`;
        state.assembledParts[partType] = true;

        updateAssemblyProgress();
    }

    // 更新组装进度
    function updateAssemblyProgress() {
        const totalParts = ROCKET_PARTS.length;
        const filledCount = Object.keys(state.assembledParts).length;
        const percentage = (filledCount / totalParts) * 100;

        const progressText = $('assemblyProgress');
        const progressBar = $('progressFill');
        const proceedBtn = $('proceedToLaunchBtn');

        if (progressText) {
            progressText.textContent = `${filledCount} / ${totalParts} 部件已安装`;
        }

        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        if (proceedBtn) {
            proceedBtn.disabled = filledCount !== totalParts;
        }
    }

    // 前往发射台
    function proceedToLaunch() {
        // 切换到发射阶段视图
        const assemblyStage = $('assemblyStage');
        const launchStage = $('launchStage');

        if (assemblyStage) assemblyStage.style.display = 'none';
        if (launchStage) launchStage.style.display = 'block';

        // 重置发射状态
        resetLaunch();

        // 平滑滚动
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 重置为组装视图
    function resetToAssembly() {
        const assemblyStage = $('assemblyStage');
        const launchStage = $('launchStage');

        if (assemblyStage) assemblyStage.style.display = 'block';
        if (launchStage) launchStage.style.display = 'none';

        // 平滑滚动
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 开始模拟发射
    function startSimulatedLaunch() {
        if (state.isLaunching) return;
        state.isLaunching = true;

        const statusText = $('statusText');
        const statusIndicator = document.querySelector('.status-indicator');
        const launchBtn = document.getElementById('launchBtn');
        const rocket = document.querySelector('.assembled-rocket');
        const flames = document.querySelector('.engine-flames');
        const glow = document.querySelector('.rocket-engine-glow');
        const clampArms = document.querySelector('.clamp-arms');
        const launchArm = document.querySelector('.launch-arm');

        if (launchBtn) launchBtn.disabled = true;
        if (statusText) statusText.textContent = '系统检查 - T-10:00';
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator warning';
        }

        // 模拟发射流程
        let countdown = 10;
        let speed = 0;
        let altitude = 0;
        let thrust = 0;

        // 倒计时阶段
        const countdownInterval = setInterval(() => {
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                
                // 点火
                if (statusText) statusText.textContent = '点火！主发动机启动';
                if (statusIndicator) statusIndicator.className = 'status-indicator launching';
                if (flames) flames.classList.add('active');
                if (glow) glow.classList.add('active');

                // 发射塔臂收回
                setTimeout(() => {
                    if (launchArm) launchArm.classList.add('retracted');
                }, 500);

                // 夹具释放
                setTimeout(() => {
                    if (clampArms) clampArms.classList.add('released');
                    if (statusText) statusText.textContent = '夹具释放 - 起飞！';
                    
                    // 产生烟雾
                    createSmoke();
                }, 1000);

                // 发射升空
                setTimeout(() => {
                    if (rocket) rocket.classList.add('launched');
                    if (statusText) statusText.textContent = '上升中... 最大推力';
                }, 1500);

                // 更新飞行数据
                const flightInterval = setInterval(() => {
                    speed += Math.random() * 500 + 200;
                    altitude += Math.random() * 500 + 300;
                    thrust = 7607; // 吨推力（Falcon 9大约值）

                    const speedMetric = $('speedMetric');
                    const altitudeMetric = $('altitudeMetric');
                    const thrustMetric = $('thrustMetric');

                    if (speedMetric) speedMetric.textContent = `${Math.round(speed).toLocaleString()} km/h`;
                    if (altitudeMetric) altitudeMetric.textContent = `${Math.round(altitude).toLocaleString()} m`;
                    if (thrustMetric) thrustMetric.textContent = `${thrust.toLocaleString()} kN`;

                    if (altitude > 100000) {
                        clearInterval(flightInterval);
                    }
                }, 500);

                // 发射完成
                setTimeout(() => {
                    if (statusText) statusText.textContent = '✅ 发射成功！轨道正常';
                    if (statusIndicator) statusIndicator.className = 'status-indicator';
                    state.isLaunching = false;
                    if (launchBtn) launchBtn.disabled = false;
                }, 10000);

                return;
            }

            if (statusText) {
                statusText.textContent = `倒计时 - T-${countdown}:00`;
            }
            countdown--;
        }, 1000);
    }

    // 创建烟雾效果
    function createSmoke() {
        const smokeContainer = document.querySelector('.smoke-container');
        if (!smokeContainer) return;

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const smoke = document.createElement('div');
                smoke.className = 'smoke-particle';
                smoke.style.left = `${20 + Math.random() * 60}%`;
                smoke.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
                smokeContainer.appendChild(smoke);

                setTimeout(() => {
                    smoke.remove();
                }, 3000);
            }, i * 200);
        }
    }

    // 重置发射
    function resetLaunch() {
        const rocket = document.querySelector('.assembled-rocket');
        const flames = document.querySelector('.engine-flames');
        const glow = document.querySelector('.rocket-engine-glow');
        const clampArms = document.querySelector('.clamp-arms');
        const launchArm = document.querySelector('.launch-arm');
        const statusText = $('statusText');
        const statusIndicator = document.querySelector('.status-indicator');
        const smokeContainer = document.querySelector('.smoke-container');

        if (rocket) rocket.classList.remove('launched');
        if (flames) flames.classList.remove('active');
        if (glow) glow.classList.remove('active');
        if (clampArms) clampArms.classList.remove('released');
        if (launchArm) launchArm.classList.remove('retracted');
        if (statusText) statusText.textContent = '准备就绪 - T-10:00';
        if (statusIndicator) statusIndicator.className = 'status-indicator';
        if (smokeContainer) smokeContainer.innerHTML = '';

        // 重置指标
        const speedMetric = $('speedMetric');
        const altitudeMetric = $('altitudeMetric');
        const thrustMetric = $('thrustMetric');

        if (speedMetric) speedMetric.textContent = '0 km/h';
        if (altitudeMetric) altitudeMetric.textContent = '0 m';
        if (thrustMetric) thrustMetric.textContent = '0 kN';

        state.isLaunching = false;
    }

    // 键盘快捷键
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // 按空格键发射（仅在发射台页面时）
            if (e.code === 'Space' && document.getElementById('launch')?.classList.contains('active')) {
                e.preventDefault();
                if (!state.isLaunching) {
                    startSimulatedLaunch();
                }
            }
        });
    }

    // 导出到全局（供HTML中的onclick调用）
    window.switchSection = switchSection;
    window.refreshNews = refreshNews;
    window.selectRocket = selectRocket;
    window.proceedToLaunch = proceedToLaunch;
    window.resetToAssembly = resetToAssembly;
    window.startSimulatedLaunch = startSimulatedLaunch;
    window.resetLaunch = resetLaunch;
    window.playVideo = function() {
        // 简单的视频播放提示（实际项目中可以集成YouTube播放器）
        alert('视频播放功能演示：在完整版本中，这里将打开视频播放器');
    };

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 自动刷新新闻（每5分钟）
    setInterval(loadNews, 5 * 60 * 1000);

})();