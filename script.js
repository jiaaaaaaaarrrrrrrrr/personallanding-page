// ================= 核心配置 (AI助手配置) =================
// 请替换为您的实际API密钥
const API_TOKEN = "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";
const API_URL = "https://models.inference.ai.azure.com/chat/completions";

// ================= AI助手系统提示词 =================
const SYSTEM_PROMPT = `你是我(Jiayee)的AI助手，专门回答关于我的设计服务的问题。
请只回答与Jiayee相关的问题，包括：
1. Jiayee的设计服务（Landing Page设计、转化率优化等）
2. Jiayee的作品案例（DigitalMarketing、SkinLab等）
3. Jiayee的设计哲学和专业技能
4. Jiayee的联系方式和合作流程
5. Jiayee的背景和经历

如果用户询问其他不相关的话题（如天气、新闻、其他设计公司等），请礼貌地拒绝回答，并引导用户关注Jiayee的设计服务。

请保持回答专业、友好、简洁，使用中文回答。`;

// ================= 图片加载优化 =================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 网站开始加载...');
    
    // 给所有图片添加加载完成后的淡入效果
    const images = document.querySelectorAll('.photo-img, .p-image');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            img.addEventListener('error', function() {
                this.classList.add('loaded');
            });
        }
    });
    
    // 预加载重要的首屏图片
    const importantImages = [
        './jiayee.png',
        './dm.jpg',
        './skinlab.jpg'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // 初始化所有功能
    initializeDynamicIsland();
    initializeAIAssistant();
    initializeFloatButton();
    initializeForm();
});

// ================= 灵动岛功能 =================
function initializeDynamicIsland() {
    console.log('🔄 初始化灵动岛...');
    const dynamicIsland = document.getElementById('dynamic-island');
    const islandClose = document.getElementById('island-close');
    const quickContactBtn = document.getElementById('quick-contact');
    const viewProjectsBtn = document.getElementById('view-projects');
    
    if (!dynamicIsland) {
        console.error('❌ 找不到灵动岛元素');
        return;
    }
    
    let isExpanded = false;
    
    // 修复灵动岛点击事件
    dynamicIsland.addEventListener('click', function(e) {
        if (e.target.closest('.island-btn') || 
            e.target.closest('.island-close') ||
            e.target.closest('#quick-contact') || 
            e.target.closest('#view-projects')) {
            return;
        }
        
        if (isExpanded) {
            collapseIsland();
        } else {
            expandIsland();
        }
    });
    
    // 关闭按钮点击事件
    if (islandClose) {
        islandClose.addEventListener('click', function(e) {
            e.stopPropagation();
            collapseIsland();
        });
    }
    
    // 快速联系按钮
    if (quickContactBtn) {
        quickContactBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            collapseIsland();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // 查看作品按钮
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            collapseIsland();
            const workSection = document.getElementById('work');
            if (workSection) {
                workSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    function expandIsland() {
        dynamicIsland.classList.remove('collapsed');
        dynamicIsland.classList.add('expanded');
        isExpanded = true;
    }
    
    function collapseIsland() {
        dynamicIsland.classList.remove('expanded');
        dynamicIsland.classList.add('collapsed');
        isExpanded = false;
    }
    
    // 初始显示灵动岛
    setTimeout(() => {
        expandIsland();
        setTimeout(() => {
            collapseIsland();
        }, 3000);
    }, 1000);
}

// ================= AI助手功能 =================
function initializeAIAssistant() {
    console.log('🤖 初始化AI助手...');
    const aiAssistant = document.getElementById('ai-assistant');
    const aiHeader = document.getElementById('ai-header');
    const aiMinimizeBtn = document.getElementById('ai-minimize');
    const aiCloseBtn = document.getElementById('ai-close');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-messages');
    
    if (!aiAssistant || !aiHeader || !aiMessages) {
        console.error('❌ 找不到AI助手元素');
        return;
    }
    
    let isAICollapsed = true; // 默认最小化
    let isProcessing = false;
    
    // 确保初始状态是最小化
    aiAssistant.classList.add('collapsed');
    
    // AI助手头部拖拽
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    aiHeader.addEventListener('mousedown', startDrag);
    aiHeader.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        if (isAICollapsed) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = aiAssistant.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    function startDragTouch(e) {
        if (isAICollapsed) return;
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        const rect = aiAssistant.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        document.addEventListener('touchmove', onDragTouch);
        document.addEventListener('touchend', stopDrag);
    }
    
    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        aiAssistant.style.left = `${startLeft + dx}px`;
        aiAssistant.style.top = `${startTop + dy}px`;
        aiAssistant.style.right = 'auto';
        aiAssistant.style.bottom = 'auto';
    }
    
    function onDragTouch(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        
        aiAssistant.style.left = `${startLeft + dx}px`;
        aiAssistant.style.top = `${startTop + dy}px`;
        aiAssistant.style.right = 'auto';
        aiAssistant.style.bottom = 'auto';
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onDragTouch);
        document.removeEventListener('touchend', stopDrag);
    }
    
    // 最小化/最大化按钮
    if (aiMinimizeBtn) {
        aiMinimizeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isAICollapsed) {
                expandAI();
            } else {
                collapseAI();
            }
        });
    }
    
    // 关闭按钮
    if (aiCloseBtn) {
        aiCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            collapseAI();
        });
    }
    
    // 点击AI助手图标展开
    aiAssistant.addEventListener('click', function(e) {
        if (isAICollapsed && !e.target.closest('.ai-btn')) {
            expandAI();
        }
    });
    
    function collapseAI() {
        aiAssistant.classList.add('collapsed');
        isAICollapsed = true;
        console.log('🤖 AI助手已最小化');
    }
    
    function expandAI() {
        aiAssistant.classList.remove('collapsed');
        isAICollapsed = false;
        console.log('🤖 AI助手已展开');
        
        // 自动滚动到底部
        setTimeout(() => {
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }, 100);
        
        // 如果有输入框，自动聚焦
        if (aiInput) {
            setTimeout(() => {
                aiInput.focus();
            }, 300);
        }
    }
    
    // 发送消息
    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIMessage();
            }
        });
    }
    
    async function sendAIMessage() {
        const message = aiInput.value.trim();
        if (!message || isProcessing) return;
        
        // 添加用户消息
        addMessage('user', message);
        aiInput.value = '';
        
        // 添加思考中状态
        const thinkingId = addMessage('assistant', '思考中...');
        
        isProcessing = true;
        aiSendBtn.disabled = true;
        
        try {
            const response = await askAI(message);
            updateMessage(thinkingId, response);
        } catch (error) {
            console.error('AI请求失败:', error);
            updateMessage(thinkingId, `<span class="error">抱歉，我暂时无法回答。请稍后重试，或直接通过表单联系Jiayee。</span>`);
        } finally {
            isProcessing = false;
            aiSendBtn.disabled = false;
            aiInput.focus();
        }
    }
    
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${role}`;
        messageDiv.innerHTML = content.replace(/\n/g, '<br>');
        
        aiMessages.appendChild(messageDiv);
        
        // 自动滚动到底部
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        return messageDiv.id = `msg-${Date.now()}`;
    }
    
    function updateMessage(id, content) {
        const messageDiv = document.getElementById(id);
        if (messageDiv) {
            messageDiv.innerHTML = content.replace(/\n/g, '<br>');
            // 重新滚动到底部
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }
    }
    
    async function askAI(userMessage) {
        console.log('🤖 发送AI请求:', userMessage);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API错误 (${response.status}): ${errorData.message || '未知错误'}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // 初始欢迎消息
    setTimeout(() => {
        addMessage('assistant', '您好！我是Jiayee的AI助手。我可以回答关于Jiayee的设计服务、作品案例、设计哲学等方面的问题。有什么可以帮您的吗？');
    }, 1500);
}

// ================= AI浮动按钮功能 =================
function initializeFloatButton() {
    console.log('🔘 初始化AI浮动按钮...');
    const floatBtn = document.getElementById('ai-float-btn');
    const aiAssistant = document.getElementById('ai-assistant');
    
    if (!floatBtn || !aiAssistant) {
        console.error('❌ 找不到浮动按钮或AI助手元素');
        return;
    }
    
    floatBtn.addEventListener('click', function() {
        console.log('🟢 点击AI浮动按钮');
        aiAssistant.classList.remove('collapsed');
        
        // 触发AI助手的展开函数
        const event = new Event('click');
        aiAssistant.dispatchEvent(event);
    });
}

// ================= 表单功能 =================
function initializeForm() {
    console.log('📝 初始化表单...');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    const contactForm = document.getElementById('contact-form');
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeSuccessPage);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', submitForm);
    }
    
    // 输入时隐藏状态消息
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', function() {
            const formStatus = document.getElementById('form-status');
            if (formStatus && formStatus.style.display !== 'none') {
                formStatus.style.display = 'none';
            }
        });
    });
    
    // ESC键关闭成功页面
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSuccessPage();
        }
    });
}

// ================= 表单提交函数 =================
async function submitForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    
    // 验证必填字段
    if (!name || !email || !message) {
        formStatus.innerHTML = '请填写所有必填字段';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        return false;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formStatus.innerHTML = '请输入有效的邮箱地址';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        return false;
    }
    
    // 验证消息长度
    if (message.length < 10) {
        formStatus.innerHTML = '请详细描述您的项目需求（至少10个字符）';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        return false;
    }
    
    // 显示加载状态
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = '发送中...';
    submitBtn.classList.add('loading');
    
    try {
        // 准备表单数据
        const formData = {
            name: name,
            email: email,
            message: message,
            source: 'jiayee-portfolio',
            website: window.location.href,
            timestamp: new Date().toISOString(),
            status: 'new'
        };
        
        // 使用JSONP方式提交到Google Apps Script
        const form = document.getElementById('contact-form');
        const iframe = document.createElement('iframe');
        iframe.name = 'submit-frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        form.target = 'submit-frame';
        form.method = 'GET';
        form.action = 'https://script.google.com/macros/s/AKfycbyL2KRIgNHGEggXogD8XfX9CxleKf7hh8vsAKBiwjDN/exec';
        
        Object.keys(formData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        });
        
        form.submit();
        
        const hiddenInputs = form.querySelectorAll('input[type="hidden"]:not([name="name"]):not([name="email"]):not([name="message"])');
        hiddenInputs.forEach(input => input.remove());
        
        setTimeout(() => {
            showSuccessPage();
            form.reset();
            form.method = 'POST';
            form.action = '';
            form.target = '_self';
            iframe.remove();
        }, 500);
        
    } catch (error) {
        console.error('提交失败:', error);
        formStatus.innerHTML = '提交失败，请稍后重试或直接发送邮件到：jiayee344@gmail.com';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
    } finally {
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.classList.remove('loading');
    }
}

function showSuccessPage() {
    const successPage = document.getElementById('success-page');
    if (successPage) {
        successPage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        successPage.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeSuccessPage() {
    const successPage = document.getElementById('success-page');
    if (successPage) {
        successPage.style.display = 'none';
        document.body.style.overflow = '';
    }
}


console.log('✅ 网站完全加载完成！');


