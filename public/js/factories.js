const GENERATE_POST_DEFAULT_PARAMS = {
    id: undefined,
    title: undefined,
    desc: undefined,
    useLink: false,
};

const GENERATE_EDITOR_DEFAULT_PARAMS = {
    id: undefined,
    title: undefined,
    desc: undefined,
    isSinglePost: false,
};

/**
 * Generate post in DOM tree
 * @param {{
*  id: number,
*  title: string,
*  desc: string,
*  useLink: boolean,
* }} - post and options
*/
function generatePost({ id, title, desc, useLink } = GENERATE_POST_DEFAULT_PARAMS) {
    const $parent = document.body.querySelector('#app .posts');

    if ($parent) {
        const $post = createElement({ 
            tag: useLink ? 'a' : 'div', 
            classList: ['post'],
            id: `post-${id}`,
            link: useLink ? `/?p=${id}` : undefined,
        });

        const $title = createElement({
            tag: 'h1',
            classList: ['title'],
            content: title,
        });

        const $desc = createElement({
            tag: 'p',
            classList: ['desc'],
            content: desc,
        });

        $post.appendChild($title);
        $post.appendChild($desc);
        $parent.appendChild($post);
    }
}

/**
* Generate editor in DOM tree
* @param {{
    *  id: number,
    *  title: string,
    *  desc: string,
    *  isSinglePost: boolean
    * }} - post and options
    */
function generateEditor({ id, title, desc, isSinglePost } = GENERATE_EDITOR_DEFAULT_PARAMS) {
    const $posts = document.querySelector('#app .posts');
    if ($posts) {
        const $firstPost = $posts.querySelector('.post');
        const $post = createElement({ tag: 'div', classList: ['post', 'editor'] });
        const $buttons = createElement({ tag: 'div', classList: ['buttons'] });
        const $title = createElement({
            tag: 'input',
            classList: ['title'],
            content: title,
            placeholder: 'title',
            isInteractive: true,
        });

        const $desc = createElement({
            tag: 'textarea',
            classList: ['desc'],
            content: desc,
            placeholder: 'description',
            isInteractive: true,
        });

        const $close = createElement({
            tag: 'span',
            classList: ['button', 'editor-button'],
            content: 'close',
            event: {
                name: 'click',
                action: () => window.location.reload(),
            },
        });

        const $submit = createElement({
            tag: 'span',
            classList: ['button', 'editor-button'],
            content: 'submit',
            event: {
                name: 'click',
                action: async () => isSinglePost
                    ? await updatePost({ id, title: $title.value, desc: $desc.value })
                    : await createPost({ title: $title.value, desc: $desc.value }),
            },
        });

        $buttons.appendChild($close);
        $buttons.appendChild($submit);
        $post.appendChild($title);
        $post.appendChild($desc);
        $post.appendChild($buttons);
        $posts.insertBefore($post, $firstPost);
    }
}

/**
* @param {{
*  tag: string,
*  id: string,
*  classList: string[],
*  link: string,
*  content: string,
*  placeholder: string,
*  isInteractive: boolean,
*  event: {
*      name: string,
*      action: () => Promise<void>
*  }
* }} - element options 
* 
* @returns {HTMLElement}
*/
function createElement({ tag, id, classList, link, content, placeholder, isInteractive, event }) {
    const $element = document.createElement(tag);

    if (isInteractive) {
        if (content) {
            $element.value = content;
        }

        if (placeholder) {
            $element.placeholder = placeholder;
        }
    } else {
        if (content) {
            $element.innerHTML = content;
        }
    }

    if (id) {
        $element.id = id;
    }

    if (link) {
        $element.href = link;
    }

    if (Array.isArray(classList) && classList.length > 0) {
        $element.classList.add(...classList);
    }

    if (event) {
        $element.addEventListener(event.name, event.action);
    }

    return $element;
}