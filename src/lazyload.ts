/**
 * Lazy Load - JavaScript plugin for lazy loading images
 * ES Module packed tuupola/lazyload 2.0.0-rc.2
 * @author KotoriK
 * @license MIT
 */
export interface LazyLoadOption {
    src: string
    srcset: string
    selector: string
    root: null
    rootMargin: "0px"
    threshold: number
}
/**
 * default option
 */
const defaults: LazyLoadOption = {
    src: "data-src",
    srcset: "data-srcset",
    selector: ".lazyload",
    root: null,
    rootMargin: "0px",
    threshold: 0
};
export type SupportedElement = HTMLImageElement | HTMLVideoElement
export type SupportedElements = NodeListOf<SupportedElement>
/**
 * @class LazyLoad
 */
export default class LazyLoad {
    constructor(elms?: SupportedElements, options?: LazyLoadOption) {
        this.opts = { ...defaults, ...options };
        this.elms = elms || document.querySelectorAll(this.opts.selector);
        this.init();
    }
    elms: SupportedElements
    obs: IntersectionObserver = null
    opts: LazyLoadOption
    init() {
        /* Without observers load everything and bail out early. */
        if (!IntersectionObserver) {
            this.load();
            return;
        }

        this.obs = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    this.obs.unobserve(entry.target);
                    this.doLoad(entry.target as SupportedElement)
                }
            }
        }, {
            root: this.opts.root,
            rootMargin: this.opts.rootMargin,
            threshold: [this.opts.threshold]
        });

        this.elms.forEach((image) => {
            this.obs.observe(image);
        })
    }

    load() {
        if (!this.opts) { return; }
        this.elms.forEach(this.doLoad);
    }
    private doLoad = (element: SupportedElement) => {
        const src = element.getAttribute(this.opts.src);
        const srcset = element.getAttribute(this.opts.srcset);
        const tagName = element.tagName.toLowerCase()
        if (src) {
            if (element.src === src || element.style.backgroundImage.includes(src)) {
                return
            }
            if (tagName === 'video' || tagName === 'img') {
                element.src = src;
            } else {
                element.style.backgroundImage = "url('" + src + "')";
            }
        }
        if (tagName === 'img' && srcset) {
            (element as HTMLImageElement).srcset = srcset;
        }
    }
    /**
     * Destroy Lazyload Instance
     * @returns
     */
    destroy() {
        if (!this.opts) { return; }
        this.obs.disconnect();
        this.opts = null;
    }
}

export const lazyload = (images?: SupportedElements, options?: LazyLoadOption) => new LazyLoad(images, options);