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
export type SupportedElements = NodeListOf<HTMLImageElement | HTMLVideoElement>
/**
 * @class LazyLoad
 */
export default class LazyLoad {
    constructor(elms: SupportedElements, options?: LazyLoadOption) {
        this.settings = { ...defaults, ...options };
        this.elms = elms || document.querySelectorAll(this.settings.selector);
        this.init();
    }
    elms: SupportedElements
    obs: IntersectionObserver = null
    settings: LazyLoadOption
    init() {
        /* Without observers load everything and bail out early. */
        if (!IntersectionObserver) {
            this.load();
            return;
        }

        const self = this;
        let observerConfig = {
            root: this.settings.root,
            rootMargin: this.settings.rootMargin,
            threshold: [this.settings.threshold]
        };

        this.obs = new IntersectionObserver(function (entries) {

            Array.prototype.forEach.call(entries, function (entry) {
                if (entry.isIntersecting) {
                    self.obs.unobserve(entry.target);
                    let src = entry.target.getAttribute(self.settings.src);
                    let srcset = entry.target.getAttribute(self.settings.srcset);
                    if ("img" === entry.target.tagName.toLowerCase()) {
                        if (src) {
                            entry.target.src = src;
                        }
                        if (srcset) {
                            entry.target.srcset = srcset;
                        }
                    } else {
                        entry.target.style.backgroundImage = "url(" + src + ")";
                    }
                }
            });
        }, observerConfig);

        this.elms.forEach((image) => {
            self.obs.observe(image);

        })
    }

    loadAndDestroy() {
        if (!this.settings) { return; }
        this.load();
        this.destroy();
    }

    load() {
        if (!this.settings) { return; }
        const { settings } = this
        Array.prototype.forEach.call(this.elms, (element) => {
            const src = element.getAttribute(settings.src);
            const srcset = element.getAttribute(settings.srcset);
            const tagName = element.tagName.toLowerCase()
            if (tagName === 'img' || tagName === 'video') {
                if (src) {
                    element.src = src;
                }
                if (srcset) {
                    element.srcset = srcset;
                }
            } else {
                element.style.backgroundImage = "url('" + src + "')";
            }
        });
    }
    /**
     * Destroy Lazyload Instance
     * @returns
     */
    destroy() {
        if (!this.settings) { return; }
        this.obs.disconnect();
        this.settings = null;
    }
}
export const lazyload = (images: SupportedElements, options: LazyLoadOption) => new LazyLoad(images, options);