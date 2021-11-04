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

/**
 * @class LazyLoad
 */
export default class LazyLoad {
    constructor(images: NodeListOf<HTMLImageElement>, options?: LazyLoadOption) {
        this.settings = { ...defaults, ...options };
        this.images = images || document.querySelectorAll(this.settings.selector);
        this.init();
    }
    images: NodeListOf<HTMLImageElement>
    observer: IntersectionObserver = null
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

        this.observer = new IntersectionObserver(function (entries) {

            Array.prototype.forEach.call(entries, function (entry) {
                if (entry.isIntersecting) {
                    self.observer.unobserve(entry.target);
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

        this.images.forEach((image) => {
            self.observer.observe(image);

        })
    }

    loadAndDestroy() {
        if (!this.settings) { return; }
        this.load();
        this.destroy();
    }

    load() {
        if (!this.settings) { return; }

        const self = this;
        Array.prototype.forEach.call(this.images, function (image) {
            let src = image.getAttribute(self.settings.src);
            let srcset = image.getAttribute(self.settings.srcset);
            if ("img" === image.tagName.toLowerCase()) {
                if (src) {
                    image.src = src;
                }
                if (srcset) {
                    image.srcset = srcset;
                }
            } else {
                image.style.backgroundImage = "url('" + src + "')";
            }
        });
    }
    /**
     * Destroy Lazyload Instance
     * @returns
     */
    destroy() {
        if (!this.settings) { return; }
        this.observer.disconnect();
        this.settings = null;
    }
}
export const lazyload = (images: NodeListOf<HTMLImageElement>, options: LazyLoadOption) => new LazyLoad(images, options);