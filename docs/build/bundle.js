
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\CheckList.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$3 } = globals;
    const file$6 = "src\\components\\CheckList.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i][0];
    	child_ctx[3] = list[i][1];
    	child_ctx[4] = list;
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (6:0) {#each Object.entries(items) as [key, item]}
    function create_each_block$4(ctx) {
    	let span;
    	let label;
    	let input;
    	let input_id_value;
    	let t0;
    	let t1_value = /*item*/ ctx[3].checklist_item_description + "";
    	let t1;
    	let t2;
    	let span_for_value;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[1].call(input, /*each_value*/ ctx[4], /*each_index*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", input_id_value = /*item*/ ctx[3].id);
    			attr_dev(input, "class", "svelte-86hf2g");
    			add_location(input, file$6, 8, 3, 151);
    			add_location(label, file$6, 7, 2, 139);
    			attr_dev(span, "for", span_for_value = /*item*/ ctx[3].id);
    			attr_dev(span, "class", "svelte-86hf2g");
    			add_location(span, file$6, 6, 1, 115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, label);
    			append_dev(label, input);
    			input.checked = /*item*/ ctx[3].checked;
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(span, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", input_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*items*/ 1 && input_id_value !== (input_id_value = /*item*/ ctx[3].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*Object, items*/ 1) {
    				input.checked = /*item*/ ctx[3].checked;
    			}

    			if (dirty & /*items*/ 1 && t1_value !== (t1_value = /*item*/ ctx[3].checklist_item_description + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*items*/ 1 && span_for_value !== (span_for_value = /*item*/ ctx[3].id)) {
    				attr_dev(span, "for", span_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(6:0) {#each Object.entries(items) as [key, item]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let each_value = Object.entries(/*items*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "checklists");
    			attr_dev(div, "class", "svelte-86hf2g");
    			add_location(div, file$6, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, items*/ 1) {
    				each_value = Object.entries(/*items*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckList', slots, []);
    	let { items = {} } = $$props;
    	const writable_props = ['items'];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckList> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler(each_value, each_index) {
    		each_value[each_index][1].checked = this.checked;
    		$$invalidate(0, items);
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({ items });

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, input_change_handler];
    }

    class CheckList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckList",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get items() {
    		throw new Error("<CheckList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<CheckList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Skills.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$2 } = globals;
    const file$5 = "src\\components\\Skills.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i][0];
    	child_ctx[5] = list[i][1];
    	return child_ctx;
    }

    // (17:1) {#each Object.entries(skills) as [key, skill]}
    function create_each_block$3(ctx) {
    	let span;
    	let label;
    	let input;
    	let input_value_value;
    	let input_id_value;
    	let input_checked_value;
    	let t0;
    	let t1_value = /*skill*/ ctx[5].skillName + "";
    	let t1;
    	let t2;
    	let span_for_value;
    	let span_id_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*skill*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", "skill");
    			input.value = input_value_value = /*skill*/ ctx[5].skillName;
    			attr_dev(input, "id", input_id_value = /*skill*/ ctx[5].id);
    			input.checked = input_checked_value = /*selectedSkill*/ ctx[1] == /*skill*/ ctx[5];
    			attr_dev(input, "class", "svelte-1t6tr37");
    			add_location(input, file$5, 20, 3, 529);
    			add_location(label, file$5, 19, 2, 517);
    			attr_dev(span, "for", span_for_value = /*skill*/ ctx[5].id);
    			attr_dev(span, "id", span_id_value = /*skill*/ ctx[5].id);
    			attr_dev(span, "class", "svelte-1t6tr37");
    			toggle_class(span, "selected", /*selectedSkill*/ ctx[1].skillName == /*skill*/ ctx[5].skillName);
    			add_location(span, file$5, 17, 1, 408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, label);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(span, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*skills*/ 1 && input_value_value !== (input_value_value = /*skill*/ ctx[5].skillName)) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (dirty & /*skills*/ 1 && input_id_value !== (input_id_value = /*skill*/ ctx[5].id)) {
    				attr_dev(input, "id", input_id_value);
    			}

    			if (dirty & /*selectedSkill, skills*/ 3 && input_checked_value !== (input_checked_value = /*selectedSkill*/ ctx[1] == /*skill*/ ctx[5])) {
    				prop_dev(input, "checked", input_checked_value);
    			}

    			if (dirty & /*skills*/ 1 && t1_value !== (t1_value = /*skill*/ ctx[5].skillName + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*skills*/ 1 && span_for_value !== (span_for_value = /*skill*/ ctx[5].id)) {
    				attr_dev(span, "for", span_for_value);
    			}

    			if (dirty & /*skills*/ 1 && span_id_value !== (span_id_value = /*skill*/ ctx[5].id)) {
    				attr_dev(span, "id", span_id_value);
    			}

    			if (dirty & /*selectedSkill, Object, skills*/ 3) {
    				toggle_class(span, "selected", /*selectedSkill*/ ctx[1].skillName == /*skill*/ ctx[5].skillName);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(17:1) {#each Object.entries(skills) as [key, skill]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t;
    	let checklist;
    	let current;
    	let each_value = Object.entries(/*skills*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	checklist = new CheckList({
    			props: { items: /*checklistItems*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(checklist.$$.fragment);
    			attr_dev(div, "id", "skills");
    			attr_dev(div, "class", "svelte-1t6tr37");
    			add_location(div, file$5, 15, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(checklist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, skills, selectedSkill*/ 3) {
    				each_value = Object.entries(/*skills*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const checklist_changes = {};
    			if (dirty & /*checklistItems*/ 4) checklist_changes.items = /*checklistItems*/ ctx[2];
    			checklist.$set(checklist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checklist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checklist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(checklist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	let { skills = {} } = $$props;
    	let selectedSkill;
    	let checklistItems = {};
    	const writable_props = ['skills'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	const click_handler = skill => $$invalidate(1, selectedSkill = skill);

    	$$self.$$set = $$props => {
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    	};

    	$$self.$capture_state = () => ({
    		CheckList,
    		skills,
    		selectedSkill,
    		checklistItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('selectedSkill' in $$props) $$invalidate(1, selectedSkill = $$props.selectedSkill);
    		if ('checklistItems' in $$props) $$invalidate(2, checklistItems = $$props.checklistItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*skills, selectedSkill*/ 3) {
    			{
    				if (Object.entries(skills)[0] && !selectedSkill) $$invalidate(1, selectedSkill = Object.entries(skills)[0][1]);
    				if (selectedSkill) $$invalidate(2, checklistItems = selectedSkill.checklistItems);
    			}
    		}
    	};

    	return [skills, selectedSkill, checklistItems, click_handler];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { skills: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get skills() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skills(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\CheckListSelector.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$1 } = globals;
    const file$4 = "src\\Components\\CheckListSelector.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i][0];
    	child_ctx[6] = list[i][1];
    	return child_ctx;
    }

    // (22:3) {#each Object.entries(data) as [key, area]}
    function create_each_block$2(ctx) {
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*area*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "button");
    			input.value = input_value_value = /*area*/ ctx[6].areaName;
    			add_location(input, file$4, 22, 4, 432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*data*/ 1 && input_value_value !== (input_value_value = /*area*/ ctx[6].areaName)) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(22:3) {#each Object.entries(data) as [key, area]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let skills_1;
    	let current;
    	let each_value = Object.entries(/*data*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	skills_1 = new Skills({
    			props: { skills: /*selectedAreaSkills*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			create_component(skills_1.$$.fragment);
    			attr_dev(div0, "id", "areas");
    			attr_dev(div0, "class", "svelte-1edwinb");
    			add_location(div0, file$4, 20, 4, 362);
    			attr_dev(div1, "id", "area-detail");
    			attr_dev(div1, "class", "svelte-1edwinb");
    			add_location(div1, file$4, 25, 1, 554);
    			attr_dev(div2, "id", "checklist_item_selector");
    			add_location(div2, file$4, 19, 0, 322);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(skills_1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Object, data, selectedAreaSkills*/ 3) {
    				each_value = Object.entries(/*data*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const skills_1_changes = {};
    			if (dirty & /*selectedAreaSkills*/ 2) skills_1_changes.skills = /*selectedAreaSkills*/ ctx[1];
    			skills_1.$set(skills_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skills_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skills_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			destroy_component(skills_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CheckListSelector', slots, []);
    	let { skills = {} } = $$props;
    	let selectedAreaSkills = [];
    	let selectedArea;
    	let data = {};
    	const writable_props = ['skills'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CheckListSelector> was created with unknown prop '${key}'`);
    	});

    	const click_handler = area => $$invalidate(1, selectedAreaSkills = area["skills"]);

    	$$self.$$set = $$props => {
    		if ('skills' in $$props) $$invalidate(2, skills = $$props.skills);
    	};

    	$$self.$capture_state = () => ({
    		Skills,
    		skills,
    		selectedAreaSkills,
    		selectedArea,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ('skills' in $$props) $$invalidate(2, skills = $$props.skills);
    		if ('selectedAreaSkills' in $$props) $$invalidate(1, selectedAreaSkills = $$props.selectedAreaSkills);
    		if ('selectedArea' in $$props) $$invalidate(3, selectedArea = $$props.selectedArea);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*skills, data, selectedArea*/ 13) {
    			{
    				$$invalidate(0, data = skills);

    				if (Object.entries(data)[0]) {
    					$$invalidate(3, selectedArea = Object.entries(data)[0][1]);
    					$$invalidate(1, selectedAreaSkills = selectedArea["skills"]);
    				}
    			}
    		}
    	};

    	return [data, selectedAreaSkills, skills, selectedArea, click_handler];
    }

    class CheckListSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { skills: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckListSelector",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get skills() {
    		throw new Error("<CheckListSelector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skills(value) {
    		throw new Error("<CheckListSelector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SVGIcon.svelte generated by Svelte v3.46.4 */

    const file$3 = "src\\components\\SVGIcon.svelte";

    // (14:0) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("unknown icon");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(14:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:26) 
    function create_if_block_2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "");
    			add_location(path, file$3, 12, 2, 413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(12:26) ",
    		ctx
    	});

    	return block;
    }

    // (10:34) 
    function create_if_block_1$1(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");
    			add_location(path, file$3, 10, 2, 317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(10:34) ",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if name == "chevron-down"}
    function create_if_block$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z");
    			add_location(path, file$3, 8, 2, 215);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(8:0) {#if name == \\\"chevron-down\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let svg;
    	let svg_data_testid_value;

    	function select_block_type(ctx, dirty) {
    		if (/*name*/ ctx[0] == "chevron-down") return create_if_block$2;
    		if (/*name*/ ctx[0] == "chevron-right") return create_if_block_1$1;
    		if (/*name*/ ctx[0] == "blank") return create_if_block_2;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if_block.c();
    			attr_dev(svg, "class", "icon svelte-pn79y6");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "data-testid", svg_data_testid_value = /*name*/ ctx[0] + 'svg-icon');
    			add_location(svg, file$3, 6, 0, 72);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if_block.m(svg, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(svg, null);
    				}
    			}

    			if (dirty & /*name*/ 1 && svg_data_testid_value !== (svg_data_testid_value = /*name*/ ctx[0] + 'svg-icon')) {
    				attr_dev(svg, "data-testid", svg_data_testid_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SVGIcon', slots, []);
    	let { name } = $$props;
    	if (!name) name = "blank";
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SVGIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class SVGIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SVGIcon",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<SVGIcon> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<SVGIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<SVGIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\TreeView.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$2 = "src\\Components\\TreeView.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (101:1) {#if shouldShowRoot()}
    function create_if_block_1(ctx) {
    	let div;
    	let svgicon;
    	let t0;
    	let t1_value = /*branch*/ ctx[0].text + "";
    	let t1;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	svgicon = new SVGIcon({
    			props: { name: /*expandIcon*/ ctx[3]() },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(svgicon.$$.fragment);
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*thisItemClasses*/ ctx[2]) + " svelte-1dft6r6"));
    			add_location(div, file$2, 101, 2, 2341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(svgicon, div, null);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*toggle*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const svgicon_changes = {};
    			if (dirty & /*expandIcon*/ 8) svgicon_changes.name = /*expandIcon*/ ctx[3]();
    			svgicon.$set(svgicon_changes);
    			if ((!current || dirty & /*branch*/ 1) && t1_value !== (t1_value = /*branch*/ ctx[0].text + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*thisItemClasses*/ 4 && div_class_value !== (div_class_value = "" + (null_to_empty(/*thisItemClasses*/ ctx[2]) + " svelte-1dft6r6"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svgicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svgicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(svgicon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(101:1) {#if shouldShowRoot()}",
    		ctx
    	});

    	return block;
    }

    // (107:1) {#if !isLeaf() && branch.expanded}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*branch*/ ctx[0].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$$props, branch, level, decendentToggled*/ 323) {
    				each_value = /*branch*/ ctx[0].items;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(107:1) {#if !isLeaf() && branch.expanded}",
    		ctx
    	});

    	return block;
    }

    // (108:2) {#each branch.items as item}
    function create_each_block$1(ctx) {
    	let treeview;
    	let current;

    	const treeview_spread_levels = [
    		/*$$props*/ ctx[8],
    		{ branch: /*item*/ ctx[21] },
    		{ level: /*level*/ ctx[1] + 1 }
    	];

    	let treeview_props = {};

    	for (let i = 0; i < treeview_spread_levels.length; i += 1) {
    		treeview_props = assign(treeview_props, treeview_spread_levels[i]);
    	}

    	treeview = new TreeView({ props: treeview_props, $$inline: true });
    	treeview.$on("itemToggled", /*decendentToggled*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(treeview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(treeview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const treeview_changes = (dirty & /*$$props, branch, level*/ 259)
    			? get_spread_update(treeview_spread_levels, [
    					dirty & /*$$props*/ 256 && get_spread_object(/*$$props*/ ctx[8]),
    					dirty & /*branch*/ 1 && { branch: /*item*/ ctx[21] },
    					dirty & /*level*/ 2 && { level: /*level*/ ctx[1] + 1 }
    				])
    			: {};

    			treeview.$set(treeview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(treeview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(treeview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(treeview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(108:2) {#each branch.items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let show_if_1 = /*shouldShowRoot*/ ctx[7]();
    	let t;
    	let div;
    	let show_if = !/*isLeaf*/ ctx[5]() && /*branch*/ ctx[0].expanded;
    	let current;
    	let if_block0 = show_if_1 && create_if_block_1(ctx);
    	let if_block1 = show_if && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "svelte-1dft6r6");
    			toggle_class(div, "sub-group", /*shouldShowRoot*/ ctx[7]());
    			add_location(div, file$2, 105, 1, 2460);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (show_if_1) if_block0.p(ctx, dirty);
    			if (dirty & /*branch*/ 1) show_if = !/*isLeaf*/ ctx[5]() && /*branch*/ ctx[0].expanded;

    			if (show_if) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*branch*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let expandIcon;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TreeView', slots, []);
    	let { branch } = $$props;
    	let { level = 0 } = $$props;
    	let { itemClass } = $$props;
    	let { leafClass } = $$props;
    	let { selectedClass } = $$props;
    	let { expandIfDecendantSelected = true } = $$props;
    	let { showRoot = false } = $$props;
    	let selectedDecendents = new Set();
    	let thisItemClasses;
    	const dispatch = createEventDispatcher();

    	const log = m => {
    		console.log("can contract", canContract());
    		console.log("expanded", branch.expanded);
    		console.log("selected", branch.selected);
    		console.log("leaf", isLeaf());
    		console.log("branch.expanded", branch.expanded);
    	};

    	function toggle() {
    		if (isLeaf()) if (branch.selected == true) deselect(); else select();

    		if (branch.expanded) {
    			if (canContract()) $$invalidate(0, branch.expanded = false, branch);
    		} else $$invalidate(0, branch.expanded = true, branch);
    	}

    	const findSelectedChildren = items => {
    		let s = new Set();

    		if (items) items.forEach(i => {
    			if (i.selected) s.add(i);
    			if (i.items) s = new Set([...s, ...findSelectedChildren(i.items)]);
    		});

    		return s;
    	};

    	const canContract = i => selectedDecendents.size == 0 || !expandIfDecendantSelected;
    	const isLeaf = () => !branch.items;

    	const select = _ => {
    		console.log("selected", branch);
    		$$invalidate(0, branch.selected = true, branch);
    		dispatch("itemToggled", branch);
    	};

    	const deselect = _ => {
    		console.log("deselected", branch);
    		$$invalidate(0, branch.selected = false, branch);
    		dispatch("itemToggled", branch);
    	};

    	const decendentToggled = e => {
    		console.log("decendentToggled", level);
    		selectedDecendents = findSelectedChildren(branch.items);
    		dispatch("itemToggled", e.detail);
    	};

    	const shouldShowRoot = () => showRoot || level > 0;
    	if (branch.selected) select();
    	selectedDecendents = findSelectedChildren(branch.items);
    	if (selectedDecendents.size) branch.expanded = true;
    	if (!showRoot && level == 0) branch.expanded = true;

    	$$self.$$set = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('branch' in $$new_props) $$invalidate(0, branch = $$new_props.branch);
    		if ('level' in $$new_props) $$invalidate(1, level = $$new_props.level);
    		if ('itemClass' in $$new_props) $$invalidate(9, itemClass = $$new_props.itemClass);
    		if ('leafClass' in $$new_props) $$invalidate(10, leafClass = $$new_props.leafClass);
    		if ('selectedClass' in $$new_props) $$invalidate(11, selectedClass = $$new_props.selectedClass);
    		if ('expandIfDecendantSelected' in $$new_props) $$invalidate(12, expandIfDecendantSelected = $$new_props.expandIfDecendantSelected);
    		if ('showRoot' in $$new_props) $$invalidate(13, showRoot = $$new_props.showRoot);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		SVGIcon,
    		branch,
    		level,
    		itemClass,
    		leafClass,
    		selectedClass,
    		expandIfDecendantSelected,
    		showRoot,
    		selectedDecendents,
    		thisItemClasses,
    		dispatch,
    		log,
    		toggle,
    		findSelectedChildren,
    		canContract,
    		isLeaf,
    		select,
    		deselect,
    		decendentToggled,
    		shouldShowRoot,
    		expandIcon
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(8, $$props = assign(assign({}, $$props), $$new_props));
    		if ('branch' in $$props) $$invalidate(0, branch = $$new_props.branch);
    		if ('level' in $$props) $$invalidate(1, level = $$new_props.level);
    		if ('itemClass' in $$props) $$invalidate(9, itemClass = $$new_props.itemClass);
    		if ('leafClass' in $$props) $$invalidate(10, leafClass = $$new_props.leafClass);
    		if ('selectedClass' in $$props) $$invalidate(11, selectedClass = $$new_props.selectedClass);
    		if ('expandIfDecendantSelected' in $$props) $$invalidate(12, expandIfDecendantSelected = $$new_props.expandIfDecendantSelected);
    		if ('showRoot' in $$props) $$invalidate(13, showRoot = $$new_props.showRoot);
    		if ('selectedDecendents' in $$props) selectedDecendents = $$new_props.selectedDecendents;
    		if ('thisItemClasses' in $$props) $$invalidate(2, thisItemClasses = $$new_props.thisItemClasses);
    		if ('expandIcon' in $$props) $$invalidate(3, expandIcon = $$new_props.expandIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*itemClass, leafClass, branch, selectedClass*/ 3585) {
    			{
    				$$invalidate(2, thisItemClasses = "itemBox " + itemClass + (isLeaf() ? ' ' + leafClass : '') + (branch.selected ? ' ' + selectedClass : ''));
    			}
    		}

    		if ($$self.$$.dirty & /*branch*/ 1) {
    			$$invalidate(3, expandIcon = () => branch.items
    			? branch.expanded ? "chevron-down" : "chevron-right"
    			: "blank");
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		branch,
    		level,
    		thisItemClasses,
    		expandIcon,
    		toggle,
    		isLeaf,
    		decendentToggled,
    		shouldShowRoot,
    		$$props,
    		itemClass,
    		leafClass,
    		selectedClass,
    		expandIfDecendantSelected,
    		showRoot
    	];
    }

    class TreeView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			branch: 0,
    			level: 1,
    			itemClass: 9,
    			leafClass: 10,
    			selectedClass: 11,
    			expandIfDecendantSelected: 12,
    			showRoot: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TreeView",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*branch*/ ctx[0] === undefined && !('branch' in props)) {
    			console_1$2.warn("<TreeView> was created without expected prop 'branch'");
    		}

    		if (/*itemClass*/ ctx[9] === undefined && !('itemClass' in props)) {
    			console_1$2.warn("<TreeView> was created without expected prop 'itemClass'");
    		}

    		if (/*leafClass*/ ctx[10] === undefined && !('leafClass' in props)) {
    			console_1$2.warn("<TreeView> was created without expected prop 'leafClass'");
    		}

    		if (/*selectedClass*/ ctx[11] === undefined && !('selectedClass' in props)) {
    			console_1$2.warn("<TreeView> was created without expected prop 'selectedClass'");
    		}
    	}

    	get branch() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set branch(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get level() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set level(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemClass() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemClass(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leafClass() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leafClass(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedClass() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedClass(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandIfDecendantSelected() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandIfDecendantSelected(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showRoot() {
    		throw new Error("<TreeView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showRoot(value) {
    		throw new Error("<TreeView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\AssignBrief.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$1 = "src\\AssignBrief.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (178:6) {#each learner_names_sorted as learner}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*learner*/ ctx[26] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*learner*/ ctx[26];
    			option.value = option.__value;
    			add_location(option, file$1, 178, 7, 5061);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*learner_names_sorted*/ 128 && t_value !== (t_value = /*learner*/ ctx[26] + "")) set_data_dev(t, t_value);

    			if (dirty & /*learner_names_sorted*/ 128 && option_value_value !== (option_value_value = /*learner*/ ctx[26])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(178:6) {#each learner_names_sorted as learner}",
    		ctx
    	});

    	return block;
    }

    // (186:6) {#each reviewer_names_sorted as reviewer}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*reviewer*/ ctx[23] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*reviewer*/ ctx[23];
    			option.value = option.__value;
    			add_location(option, file$1, 186, 7, 5369);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*reviewer_names_sorted*/ 256 && t_value !== (t_value = /*reviewer*/ ctx[23] + "")) set_data_dev(t, t_value);

    			if (dirty & /*reviewer_names_sorted*/ 256 && option_value_value !== (option_value_value = /*reviewer*/ ctx[23])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(186:6) {#each reviewer_names_sorted as reviewer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div3;
    	let form;
    	let section0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let section1;
    	let label1;
    	let t4;
    	let div1;
    	let input1;
    	let t5;
    	let div0;
    	let t7;
    	let section2;
    	let label2;
    	let t9;
    	let select0;
    	let t10;
    	let section3;
    	let label3;
    	let t12;
    	let select1;
    	let t13;
    	let section4;
    	let label4;
    	let t15;
    	let input2;
    	let t16;
    	let section5;
    	let label5;
    	let t18;
    	let div2;
    	let label6;
    	let input3;
    	let t19;
    	let t20;
    	let label7;
    	let input4;
    	let t21;
    	let t22;
    	let section6;
    	let label8;
    	let t24;
    	let checklistselector;
    	let t25;
    	let section7;
    	let label9;
    	let t27;
    	let treeview;
    	let t28;
    	let input5;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*learner_names_sorted*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*reviewer_names_sorted*/ ctx[8];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	checklistselector = new CheckListSelector({
    			props: { skills: /*skills*/ ctx[0] },
    			$$inline: true
    		});

    	treeview = new TreeView({
    			props: {
    				branch: /*skillsTree*/ ctx[1],
    				itemClass: "",
    				leafClass: "",
    				selectedClass: "blue",
    				expandIfDecendantSelected: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			form = element("form");
    			section0 = element("section");
    			label0 = element("label");
    			label0.textContent = "Brief Title:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			section1 = element("section");
    			label1 = element("label");
    			label1.textContent = "Google Drive Link";
    			t4 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div0 = element("div");
    			div0.textContent = "Add a link to a Google drive folder shared with cleachtas@gmail.com, containing the brief.)";
    			t7 = space();
    			section2 = element("section");
    			label2 = element("label");
    			label2.textContent = "Assign a learner:";
    			t9 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t10 = space();
    			section3 = element("section");
    			label3 = element("label");
    			label3.textContent = "Reviewers";
    			t12 = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			section4 = element("section");
    			label4 = element("label");
    			label4.textContent = "Submission deadline:";
    			t15 = space();
    			input2 = element("input");
    			t16 = space();
    			section5 = element("section");
    			label5 = element("label");
    			label5.textContent = "Asignment Type:";
    			t18 = space();
    			div2 = element("div");
    			label6 = element("label");
    			input3 = element("input");
    			t19 = text("\r\n\t\t\t\t\t\tExemplar");
    			t20 = space();
    			label7 = element("label");
    			input4 = element("input");
    			t21 = text("\r\n\t\t\t\t\t\t\tBrief");
    			t22 = space();
    			section6 = element("section");
    			label8 = element("label");
    			label8.textContent = "Checklist items";
    			t24 = space();
    			create_component(checklistselector.$$.fragment);
    			t25 = space();
    			section7 = element("section");
    			label9 = element("label");
    			label9.textContent = "Checklist items";
    			t27 = space();
    			create_component(treeview.$$.fragment);
    			t28 = space();
    			input5 = element("input");
    			attr_dev(label0, "for", "brief-title");
    			attr_dev(label0, "class", "svelte-dgykw1");
    			add_location(label0, file$1, 164, 6, 4267);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "brief-title");
    			attr_dev(input0, "class", "brief_title svelte-dgykw1");
    			attr_dev(input0, "placeholder", "Add a title for the brief");
    			input0.required = true;
    			add_location(input0, file$1, 165, 9, 4323);
    			attr_dev(section0, "id", "title");
    			attr_dev(section0, "class", "svelte-dgykw1");
    			add_location(section0, file$1, 163, 3, 4238);
    			attr_dev(label1, "for", "attach-brief");
    			attr_dev(label1, "class", "svelte-dgykw1");
    			add_location(label1, file$1, 168, 5, 4508);
    			set_style(input1, "width", "100%");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "attach-brief");
    			attr_dev(input1, "id", "attach-brief");
    			input1.required = true;
    			add_location(input1, file$1, 170, 6, 4579);
    			add_location(div0, file$1, 171, 6, 4696);
    			attr_dev(div1, "class", "svelte-dgykw1");
    			add_location(div1, file$1, 169, 5, 4566);
    			attr_dev(section1, "id", "drive_link");
    			attr_dev(section1, "class", "svelte-dgykw1");
    			add_location(section1, file$1, 167, 3, 4475);
    			attr_dev(label2, "for", "learner");
    			attr_dev(label2, "class", "svelte-dgykw1");
    			add_location(label2, file$1, 175, 5, 4861);
    			attr_dev(select0, "name", "learner");
    			attr_dev(select0, "id", "learners");
    			select0.multiple = true;
    			select0.required = true;
    			if (/*selected_learners*/ ctx[6] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[14].call(select0));
    			add_location(select0, file$1, 176, 9, 4918);
    			attr_dev(section2, "id", "learner");
    			attr_dev(section2, "class", "svelte-dgykw1");
    			add_location(section2, file$1, 174, 3, 4831);
    			attr_dev(label3, "for", "learner");
    			attr_dev(label3, "class", "svelte-dgykw1");
    			add_location(label3, file$1, 183, 5, 5172);
    			attr_dev(select1, "name", "reviewers");
    			attr_dev(select1, "id", "reviewers");
    			select1.multiple = true;
    			select1.required = true;
    			if (/*selected_reviewers*/ ctx[5] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[15].call(select1));
    			add_location(select1, file$1, 184, 9, 5221);
    			attr_dev(section3, "id", "reviewer");
    			attr_dev(section3, "class", "svelte-dgykw1");
    			add_location(section3, file$1, 182, 4, 5141);
    			attr_dev(label4, "for", "submission-datetime");
    			attr_dev(label4, "class", "svelte-dgykw1");
    			add_location(label4, file$1, 192, 6, 5483);
    			attr_dev(input2, "id", "submission-datetime");
    			attr_dev(input2, "type", "datetime-local");
    			attr_dev(input2, "class", "svelte-dgykw1");
    			add_location(input2, file$1, 193, 9, 5555);
    			attr_dev(section4, "id", "deadline");
    			attr_dev(section4, "class", "svelte-dgykw1");
    			add_location(section4, file$1, 191, 3, 5451);
    			attr_dev(label5, "for", "submission-datetime");
    			attr_dev(label5, "class", "svelte-dgykw1");
    			add_location(label5, file$1, 197, 5, 5678);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "id", "exemplar");
    			attr_dev(input3, "name", "brief_type");
    			input3.__value = "exemplar";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[17][0].push(input3);
    			add_location(input3, file$1, 200, 7, 5814);
    			attr_dev(label6, "class", "radio");
    			attr_dev(label6, "for", "exemplar");
    			add_location(label6, file$1, 199, 6, 5769);
    			attr_dev(input4, "type", "radio");
    			attr_dev(input4, "id", "brief");
    			attr_dev(input4, "name", "brief_type");
    			input4.__value = "brief";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[17][0].push(input4);
    			add_location(input4, file$1, 204, 7, 5994);
    			attr_dev(label7, "class", "radio");
    			attr_dev(label7, "for", "brief");
    			add_location(label7, file$1, 203, 6, 5952);
    			attr_dev(div2, "class", "radios svelte-dgykw1");
    			add_location(div2, file$1, 198, 5, 5741);
    			attr_dev(section5, "id", "assignment_type");
    			attr_dev(section5, "class", "svelte-dgykw1");
    			add_location(section5, file$1, 196, 3, 5640);
    			attr_dev(label8, "for", "");
    			attr_dev(label8, "class", "svelte-dgykw1");
    			add_location(label8, file$1, 209, 5, 6175);
    			attr_dev(section6, "id", "checklist");
    			attr_dev(section6, "class", "svelte-dgykw1");
    			add_location(section6, file$1, 208, 4, 6143);
    			attr_dev(label9, "for", "");
    			attr_dev(label9, "class", "svelte-dgykw1");
    			add_location(label9, file$1, 213, 5, 6304);
    			attr_dev(section7, "id", "checklist");
    			attr_dev(section7, "class", "svelte-dgykw1");
    			add_location(section7, file$1, 212, 6, 6272);
    			attr_dev(input5, "id", "submit");
    			attr_dev(input5, "type", "submit");
    			input5.value = "Submit";
    			add_location(input5, file$1, 217, 6, 6528);
    			add_location(form, file$1, 162, 3, 4193);
    			attr_dev(div3, "id", "assign-brief");
    			attr_dev(div3, "class", "outer_shell");
    			add_location(div3, file$1, 161, 4, 4143);
    			add_location(div4, file$1, 160, 0, 4132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, form);
    			append_dev(form, section0);
    			append_dev(section0, label0);
    			append_dev(section0, t1);
    			append_dev(section0, input0);
    			set_input_value(input0, /*brief_title*/ ctx[2]);
    			append_dev(form, t2);
    			append_dev(form, section1);
    			append_dev(section1, label1);
    			append_dev(section1, t4);
    			append_dev(section1, div1);
    			append_dev(div1, input1);
    			set_input_value(input1, /*brief_link*/ ctx[3]);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(form, t7);
    			append_dev(form, section2);
    			append_dev(section2, label2);
    			append_dev(section2, t9);
    			append_dev(section2, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_options(select0, /*selected_learners*/ ctx[6]);
    			append_dev(form, t10);
    			append_dev(form, section3);
    			append_dev(section3, label3);
    			append_dev(section3, t12);
    			append_dev(section3, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_options(select1, /*selected_reviewers*/ ctx[5]);
    			append_dev(form, t13);
    			append_dev(form, section4);
    			append_dev(section4, label4);
    			append_dev(section4, t15);
    			append_dev(section4, input2);
    			append_dev(form, t16);
    			append_dev(form, section5);
    			append_dev(section5, label5);
    			append_dev(section5, t18);
    			append_dev(section5, div2);
    			append_dev(div2, label6);
    			append_dev(label6, input3);
    			input3.checked = input3.__value === /*assignmentType*/ ctx[4];
    			append_dev(label6, t19);
    			append_dev(div2, t20);
    			append_dev(div2, label7);
    			append_dev(label7, input4);
    			input4.checked = input4.__value === /*assignmentType*/ ctx[4];
    			append_dev(label7, t21);
    			append_dev(form, t22);
    			append_dev(form, section6);
    			append_dev(section6, label8);
    			append_dev(section6, t24);
    			mount_component(checklistselector, section6, null);
    			append_dev(form, t25);
    			append_dev(form, section7);
    			append_dev(section7, label9);
    			append_dev(section7, t27);
    			mount_component(treeview, section7, null);
    			append_dev(form, t28);
    			append_dev(form, input5);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[14]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[15]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[16]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[18]),
    					listen_dev(form, "submit", prevent_default(/*submit*/ ctx[9]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*brief_title*/ 4 && input0.value !== /*brief_title*/ ctx[2]) {
    				set_input_value(input0, /*brief_title*/ ctx[2]);
    			}

    			if (dirty & /*brief_link*/ 8 && input1.value !== /*brief_link*/ ctx[3]) {
    				set_input_value(input1, /*brief_link*/ ctx[3]);
    			}

    			if (dirty & /*learner_names_sorted*/ 128) {
    				each_value_1 = /*learner_names_sorted*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*selected_learners, learner_names_sorted*/ 192) {
    				select_options(select0, /*selected_learners*/ ctx[6]);
    			}

    			if (dirty & /*reviewer_names_sorted*/ 256) {
    				each_value = /*reviewer_names_sorted*/ ctx[8];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selected_reviewers, reviewer_names_sorted*/ 288) {
    				select_options(select1, /*selected_reviewers*/ ctx[5]);
    			}

    			if (dirty & /*assignmentType*/ 16) {
    				input3.checked = input3.__value === /*assignmentType*/ ctx[4];
    			}

    			if (dirty & /*assignmentType*/ 16) {
    				input4.checked = input4.__value === /*assignmentType*/ ctx[4];
    			}

    			const checklistselector_changes = {};
    			if (dirty & /*skills*/ 1) checklistselector_changes.skills = /*skills*/ ctx[0];
    			checklistselector.$set(checklistselector_changes);
    			const treeview_changes = {};
    			if (dirty & /*skillsTree*/ 2) treeview_changes.branch = /*skillsTree*/ ctx[1];
    			treeview.$set(treeview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checklistselector.$$.fragment, local);
    			transition_in(treeview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checklistselector.$$.fragment, local);
    			transition_out(treeview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*$$binding_groups*/ ctx[17][0].splice(/*$$binding_groups*/ ctx[17][0].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[17][0].splice(/*$$binding_groups*/ ctx[17][0].indexOf(input4), 1);
    			destroy_component(checklistselector);
    			destroy_component(treeview);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AssignBrief', slots, []);
    	let { learners = [] } = $$props;
    	let { reviewers = [] } = $$props;
    	let { skills = [] } = $$props;
    	let { skillsTree = [] } = $$props;
    	let data = {};
    	let brief_title;
    	let brief_link;
    	let assignmentType;
    	let selected_reviewers = [];
    	let selected_learners = [];

    	// let treedata = {
    	// 	 text: "root",
    	// 	 items:[
    	// 		 {
    	// 			text: "test",
    	// 			items: [
    	// 				{ text: "subtest" },
    	// 				{ text: "subtest2" },
    	// 				{ text: "subtest3" },
    	// 				{ text: "subtest4", 
    	// 					items: [
    	// 						{ text: "subtest" , selected: false },
    	// 						{ text: "subtest2" },
    	// 						{ text: "subtest3" },
    	// 						{ text: "subtest4" },
    	// 					]
    	// 				},
    	// 			]
    	// 		},
    	// 		{
    	// 			text: "test2",
    	// 			items: [
    	// 				{ text: "subtest" },
    	// 				{ text: "subtest2" },
    	// 				{ text: "subtest3" },
    	// 				{ text: "subtest4" },
    	// 			]
    	// 		},
    	// 		{
    	// 			text: "test3",
    	// 			items: [
    	// 				{ text: "subtest" },
    	// 				{ text: "subtest2" },
    	// 				{ text: "subtest3" , selected: true},
    	// 				{ text: "subtest4" },
    	// 			]
    	// 		}
    	// ]};
    	let learner_names_sorted = [];

    	let reviewer_names_sorted = [];

    	function getChecked() {
    		var listOfTriples = [];
    		data = skills;

    		Object.entries(data).forEach(area => Object.entries(area[1].skills).forEach(skill => Object.entries(skill[1].checklistItems).forEach(checklistItem => {
    			console.log(checklistItem);
    			if (checklistItem[1].checked) listOfTriples.push(checklistItem[1].checklist_item_triple);
    		})));

    		return listOfTriples;
    	}

    	function submit() {
    		let data = {};
    		data.author_email = "";
    		data.brief_title = brief_title;
    		data.upload_url = brief_link;

    		if (!assignmentType) {
    			alert("You need to select a exemplar or brief type");
    			return;
    		}

    		data.brief_type = assignmentType;
    		data.learners = selected_learners;
    		data.reviewers = selected_reviewers;
    		const selected_checklist_item_triples = getChecked();

    		if (selected_checklist_item_triples.length == 0) {
    			alert("You have to at least one skill selected!");
    			return;
    		}

    		data.selected_checklist_item_triples = JSON.stringify(selected_checklist_item_triples);
    		var submissionDatetime = document.getElementById("submission-datetime").value;

    		if (submissionDatetime == '') {
    			alert("You haven't set a submission date!");
    			return;
    		}

    		let datetime = new Date(submissionDatetime);
    		let date = datetime.toLocaleDateString('en-GB');
    		let time = datetime.toLocaleTimeString('en-GB');
    		data.deadline_date = date;
    		data.deadline_time = time;
    		data.review_deadline_date = date;
    		data.review_deadline_time = time;
    		data.final_deadline_date = date;
    		data.final_deadline_time = time;
    		console.log(data);
    	} //      fetch(app.baseUrl + '/assign_brief',
    	//          {method:'POST',

    	//              headers:{'Content-Type': 'application/json'},
    	//              body: JSON.stringify(data)})
    	//             .then(response => {
    	//                 if (!response.ok) {
    	//                     app.r = response;
    	//                     response.text().then(t=>alert(t));
    	//                     //alert(response);
    	//                     console.log(response);
    	//                 }
    	//                 else
    	//                 {
    	//                     document.getElementById("assign-brief").style.display = "none";
    	//                     document.getElementById("assign-brief-complete").style.display = "block";
    	//                 }
    	//                console.log(data);
    	//             })
    	const firstDictItemKey = dict => Object.keys(dict)[0];

    	const firstDictItem = dict => dict[firstDictItemKey(dict)];
    	const writable_props = ['learners', 'reviewers', 'skills', 'skillsTree'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<AssignBrief> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input0_input_handler() {
    		brief_title = this.value;
    		$$invalidate(2, brief_title);
    	}

    	function input1_input_handler() {
    		brief_link = this.value;
    		$$invalidate(3, brief_link);
    	}

    	function select0_change_handler() {
    		selected_learners = select_multiple_value(this);
    		$$invalidate(6, selected_learners);
    		(($$invalidate(7, learner_names_sorted), $$invalidate(10, learners)), $$invalidate(11, reviewers));
    	}

    	function select1_change_handler() {
    		selected_reviewers = select_multiple_value(this);
    		$$invalidate(5, selected_reviewers);
    		(($$invalidate(8, reviewer_names_sorted), $$invalidate(10, learners)), $$invalidate(11, reviewers));
    	}

    	function input3_change_handler() {
    		assignmentType = this.__value;
    		$$invalidate(4, assignmentType);
    	}

    	function input4_change_handler() {
    		assignmentType = this.__value;
    		$$invalidate(4, assignmentType);
    	}

    	$$self.$$set = $$props => {
    		if ('learners' in $$props) $$invalidate(10, learners = $$props.learners);
    		if ('reviewers' in $$props) $$invalidate(11, reviewers = $$props.reviewers);
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('skillsTree' in $$props) $$invalidate(1, skillsTree = $$props.skillsTree);
    	};

    	$$self.$capture_state = () => ({
    		CheckListSelector,
    		TreeView,
    		learners,
    		reviewers,
    		skills,
    		skillsTree,
    		data,
    		brief_title,
    		brief_link,
    		assignmentType,
    		selected_reviewers,
    		selected_learners,
    		learner_names_sorted,
    		reviewer_names_sorted,
    		getChecked,
    		submit,
    		firstDictItemKey,
    		firstDictItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('learners' in $$props) $$invalidate(10, learners = $$props.learners);
    		if ('reviewers' in $$props) $$invalidate(11, reviewers = $$props.reviewers);
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('skillsTree' in $$props) $$invalidate(1, skillsTree = $$props.skillsTree);
    		if ('data' in $$props) data = $$props.data;
    		if ('brief_title' in $$props) $$invalidate(2, brief_title = $$props.brief_title);
    		if ('brief_link' in $$props) $$invalidate(3, brief_link = $$props.brief_link);
    		if ('assignmentType' in $$props) $$invalidate(4, assignmentType = $$props.assignmentType);
    		if ('selected_reviewers' in $$props) $$invalidate(5, selected_reviewers = $$props.selected_reviewers);
    		if ('selected_learners' in $$props) $$invalidate(6, selected_learners = $$props.selected_learners);
    		if ('learner_names_sorted' in $$props) $$invalidate(7, learner_names_sorted = $$props.learner_names_sorted);
    		if ('reviewer_names_sorted' in $$props) $$invalidate(8, reviewer_names_sorted = $$props.reviewer_names_sorted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*learners, reviewers*/ 3072) {
    			{
    				$$invalidate(7, learner_names_sorted = learners.sort());
    				$$invalidate(8, reviewer_names_sorted = reviewers.sort());
    			}
    		}
    	};

    	return [
    		skills,
    		skillsTree,
    		brief_title,
    		brief_link,
    		assignmentType,
    		selected_reviewers,
    		selected_learners,
    		learner_names_sorted,
    		reviewer_names_sorted,
    		submit,
    		learners,
    		reviewers,
    		input0_input_handler,
    		input1_input_handler,
    		select0_change_handler,
    		select1_change_handler,
    		input3_change_handler,
    		$$binding_groups,
    		input4_change_handler
    	];
    }

    class AssignBrief extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			learners: 10,
    			reviewers: 11,
    			skills: 0,
    			skillsTree: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AssignBrief",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get learners() {
    		throw new Error("<AssignBrief>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set learners(value) {
    		throw new Error("<AssignBrief>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reviewers() {
    		throw new Error("<AssignBrief>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reviewers(value) {
    		throw new Error("<AssignBrief>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skills() {
    		throw new Error("<AssignBrief>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skills(value) {
    		throw new Error("<AssignBrief>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skillsTree() {
    		throw new Error("<AssignBrief>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillsTree(value) {
    		throw new Error("<AssignBrief>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const d = `{"learner_names":["Test1","Test5","Test3","TestC","Test2","TestF","Test4","TestE","B","A","TestA","TestG","TestB","TestD","Learner A","Test Student","Test Student2","N**** Mc****","K** Po***1","K** Po**2","K** Po**3","D**** O B****1","D**** O B****2","Reviewer A","A**** McG***"],"reviewer_names":["Test1","Test5","Test3","TestC","Test2","TestF","Test4","TestE","B","A","TestA","TestG","TestB","TestD","Learner A","Test Student","Test Student2","N**** Mc****","K** Po***1","K** Po**2","K** Po**3","D**** O B****1","D**** O B****2","Reviewer A","A**** McG***"],"skills_table":[["Organisation","Research aims or questions","Are the aims/research question(s) clear, precise and achievable?"],["Organisation","Research aims or questions","Are the verbs used to describe the aims aligned with the methodology used? (e.g. explore, measure, determine etc.)"],["Organisation","Research aims or questions","Are the aims of the research contextualised in a relevant way, e.g. in relation to developments in policy, practice and academic literature?"],["Organisation","Research aims or questions","Are sound reasons provided for having these aims as the focus of the research, e.g. gaps in academic literature, developments in policy or practice?"],["Organisation","Thesis statement","Is a concise summary of the main point or argument of the research provided?"],["Organisation","Focus","check2/check 3"],["Organisation","Paragraph structure","Are the paragraphs internally logical?"],["Organisation","Paragraph structure","Does the paragraph has a topic sentence and a concluding sentence?"],["Organisation","Ordering","check 4"],["Organisation","Signposting","is the reader guided through the text with link words, bridging etc."],["Organisation","Bridging/making small transitions","Are transitional words or phrases used within or between paragraphs to express similiarity or dissimilarity )e.g. likewise, in the same way, on the other hand, despite, in contrast)"],["Organisation","Bridging/making small transitions","Are transitional words or phrases used within or between paragraphs to indicate temporal (e.g. first, second, later, finally) or causal (e.g. accordingly, because, therefore) ordering?"],["Organisation","Bridging/making big transitions","Are transitional words or phrases used to remind the reader of what has earlier been argued (as previously mentioned, in short, on the whole)"],["Mechanics","Grammar","Is the grammar correct?"],["Style ","Clarity of language ","Does the author avoid overly long, poorly punctuated sentences?"],["Style ","Clarity of language ","Does the author avoid overly using niche jargon?"],["Style ","Clarity of language ","Are technical terms clearly explained?"],["Style ","Clarity of language ","Are abstract ideas anchored in concrete language and images?"],["Style ","Clarity of language ","Are abstract concepts illustrated with examples?"],["Style ","Use of sources ","Are all sources fully referenced?"],["Style ","Use of sources ","Are signal phrases (e.g. 'as Murphy illustrates') used to indicate that the author is introducing material taken from sources?"],["Style ","Use of sources ","Do the referenced sources align with the argument of the author?"],["Analysis","argument","Is the author's position clear?"],["Analysis","argument","Does the author offer sound evidence or reasoning in support of their position?"],["Analysis","methodology/research design","Are methodological choices clearly identified and explained?"],["Analysis","methodology/research design","Are methodological choices justified and critically analysed? "],["Analysis","methodology/research design","Is the researcher's positionality explained and its implications fully analysed?"],["Analysis","methodology/research design","Are all ethical considerations relevant to the project identified?"],["Analysis","methodology/research design","Are strategies in place to address all identified ethical issues?"],["Analysis","use of theory ","Are the theoretical concepts or frameworks underpinning the study clearly articulated?"],["Analysis","use of theory ","Are the theoretical concepts or frameworks underpinning the study critically analysed?"],["Analysis","use of theory ","Are the theoretical concepts or frameworks underpinning the study appropriate and convincing?"],["Formal","Author","Name of Author(s)"],[" ","Abstract","Does it provide: the context or background information for the research; the general topic under study; the specific topic of the research?"],["Content","Abstract","Does it give the central questions or statement of the problem the research addresses?"],["Content","Abstract","Does it summarise what\u2019s already known about this question, what previous research has done or shown"],["Content","Abstract","Does it provide the main reason(s), the exigency, the rationale, the goals for the research\u2014Why is it important to address these questions? (Why is that topic worth examining? Does it fill a gap in previous research? Apply new methods to take a fresh look at existing ideas or data? Resolving a dispute within the literature in the field? . . .)"],["Content","Abstract","Are the research questions clearly set out?"],["Content","Abstract","Does it explain work done so far and what is the plan (including possible research methods)?"],["Content","Abstract","Does it summarise the main findings, results, or arguments?"],["Content","Abstract","Is the significance or implications of  findings or arguments mentioned?"],["Content","Methodology1","Are the goals of the study are clearly defined"],["Content","Methodology1","Are the research question(s) clearly defined and can they potentially be answered with the data"],["Content","Methodology1","Are the hypotheses clear and can they potentially be supported by the data?"],["Content","Methodology1","Is the design clearly described?"],["Content","Methodology1","Is the design clearly justified?"],["Content","Methodology1","Is the operationalisation of constructs justified (e.g. using existing instruments)?"],["Content","Methodology1","Is the procedure clear and detailed enough to be carried out without any input from the researcher"],["Content","Methodology1","Is it written in the past tense?"],["Content","Lit review section 1","Is the area of interest explained?"],["Content","Lit review section 1","Is the purpose of the review made evident to the reader?"],["Content","Lit review section 1","If terminology or concepts are being introduced as part of the review, are these defined or clarified?"],["Content","Lit review section 1","Is the organization of the review made evident to the reader?"],["Content","Abstract2","Is the  gap or problem  or  main  issue the work focuses on clear?"],["Content","Abstract2","Is it clear why they went about  the work the way they did and how they did it?"],["Content","Abstract2","Is it clear what they found or created?"],["Content","Abstract2","Is the contribution this work makes to knowledge and meaning clear?"],["Content","Abstract2","Is it clear why the work matters?"],["Content","Abstract2","Overall, is the abstract clear?"],["Content","Abstract2_old","Is it more of  a summary  than  an  abstract? "],["Content","Abstract v3","Is the central question or statement of the problem clearly and precisely stated? "],["Content","Abstract v3","Does it summarise what\u2019s already known about this question/problem?  (What previous research has done or shown)"],["Content","Abstract v3","Does it provide the main reason(s) for doing the research? "],["Content","Abstract v3","Does it explain how the research was undertaken (e.g. research methods, approach,)"],["Content","Abstract v3","Does it summarise the main findings, results, or arguments?"],["Content","Abstract v3","Does it explain the significance or implication(s) of the findings or argument(s)? "],["Organisation","Paragraph structure v2","Is the topic sentence precise, brief, yet thorough?"],["Organisation","Paragraph structure v2","Does every idea relate to the topic sentence?"],["Organisation","Paragraph structure v2","Does the ordering of the ideas make sense?"],["Organisation","Paragraph structure v2","Is the topic sentence elaborated?"],["Organisation","Paragraph structure v2","Are link words used effectively to help the reader follow the ideas?"]]}`;

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (132:0) {#if skillsHierarchy}
    function create_if_block(ctx) {
    	let assignbrief;
    	let current;

    	assignbrief = new AssignBrief({
    			props: {
    				learners: /*theData*/ ctx[0].learner_names,
    				reviewers: /*theData*/ ctx[0].reviewer_names,
    				skills: /*skillsHierarchy*/ ctx[1],
    				skillsTree: /*skillsTree*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(assignbrief.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(assignbrief, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const assignbrief_changes = {};
    			if (dirty & /*theData*/ 1) assignbrief_changes.learners = /*theData*/ ctx[0].learner_names;
    			if (dirty & /*theData*/ 1) assignbrief_changes.reviewers = /*theData*/ ctx[0].reviewer_names;
    			if (dirty & /*skillsHierarchy*/ 2) assignbrief_changes.skills = /*skillsHierarchy*/ ctx[1];
    			if (dirty & /*skillsTree*/ 4) assignbrief_changes.skillsTree = /*skillsTree*/ ctx[2];
    			assignbrief.$set(assignbrief_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(assignbrief.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(assignbrief.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(assignbrief, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(132:0) {#if skillsHierarchy}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let div;
    	let current;
    	let if_block = /*skillsHierarchy*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			div.textContent = "Your brief has been assigned.  Refresh this page to assign a new brief.";
    			attr_dev(div, "id", "assign-brief-complete");
    			set_style(div, "display", "none");
    			add_location(div, file, 140, 0, 3757);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*skillsHierarchy*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*skillsHierarchy*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let app = {};
    	let theData = {};
    	let loaded = false;
    	let skillsHierarchy;
    	let skillsTree;
    	let promise = Promise.resolve([]);

    	const log = e => {
    		console.log(e);
    		return e;
    	};

    	app.baseUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/ReviewSystem";

    	if (window.location.hostname == "localhost") {
    		app.baseUrl = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
    	}

    	const getValidId = s => s.replace(/[^\w]/g, ''); //remove whitespace

    	function createSkillsHierarchy(skills) {
    		var skillsHierarchy = {};

    		skills.forEach(skillRow => {
    			var areaName = skillRow[0];
    			var areaId = getValidId(areaName);
    			var skillName = skillRow[1];
    			var skillId = getValidId(skillName);
    			var checklistItemDescription = skillRow[2];
    			var checklistItemId = getValidId(checklistItemDescription);
    			if (!(areaId in skillsHierarchy)) skillsHierarchy[areaId] = { areaName, "skills": {} };
    			if (!(skillId in skillsHierarchy[areaId]["skills"])) skillsHierarchy[areaId]["skills"][skillId] = { skillName, "checklistItems": {} };
    			var checklistItem = {};
    			checklistItem["checklist_item_description"] = checklistItemDescription;
    			checklistItem["checklist_item_triple"] = skillRow;
    			skillsHierarchy[areaId]["skills"][skillId]["checklistItems"][checklistItemId] = checklistItem;
    		});

    		return skillsHierarchy;
    	}

    	function createSkillsTree(skills) {
    		var skillsTree = { text: "areas", items: [] };

    		skills.forEach(skillRow => {
    			var areaName = skillRow[0];
    			var areaId = getValidId(areaName);
    			var skillName = skillRow[1];
    			var skillId = getValidId(skillName);
    			var checklistItemDescription = skillRow[2];
    			var checklistItemId = getValidId(checklistItemDescription);
    			var areaNode = skillsTree.items.find(item => item.id == areaId);

    			if (!areaNode) {
    				areaNode = { id: areaId, text: areaName, items: [] };
    				skillsTree.items.push(areaNode);
    			}

    			var skillNode = areaNode.items.find(item => item.id == skillId);

    			if (!skillNode) {
    				skillNode = { id: skillId, text: skillName, items: [] };
    				areaNode.items.push(skillNode);
    			}

    			var checklistItemNode = skillNode.items.find(item => item.id == checklistItemId);

    			if (!checklistItemNode) {
    				checklistItemNode = {
    					id: checklistItemId,
    					text: checklistItemDescription
    				};

    				skillNode.items.push(checklistItemNode);
    			}
    		});

    		return skillsTree;
    	}

    	app.baseUrl = "https://gamecore.itcarlow.ie/ReviewSystemDev";

    	onMount(async () => {
    		// CORS prevents calling real endpoint
    		// const res = await fetch(app.baseUrl+'get_assign_brief_data');
    		// 			.then(response => response.json())
    		// 			.then(data => {
    		// 				console.log(data);
    		// 				theData = data;
    		// 			})
    		// 			.catch(error => {
    		// 				console.log("An Error");
    		// 				console.log(error);
    		// 			});
    		//fake data
    		$$invalidate(0, theData = JSON.parse(d));

    		$$invalidate(1, skillsHierarchy = createSkillsHierarchy(theData.skills_table));
    		$$invalidate(2, skillsTree = createSkillsTree(theData.skills_table));
    		console.log(skillsTree);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AssignBrief,
    		onMount,
    		d,
    		app,
    		theData,
    		loaded,
    		skillsHierarchy,
    		skillsTree,
    		promise,
    		log,
    		getValidId,
    		createSkillsHierarchy,
    		createSkillsTree
    	});

    	$$self.$inject_state = $$props => {
    		if ('app' in $$props) app = $$props.app;
    		if ('theData' in $$props) $$invalidate(0, theData = $$props.theData);
    		if ('loaded' in $$props) loaded = $$props.loaded;
    		if ('skillsHierarchy' in $$props) $$invalidate(1, skillsHierarchy = $$props.skillsHierarchy);
    		if ('skillsTree' in $$props) $$invalidate(2, skillsTree = $$props.skillsTree);
    		if ('promise' in $$props) promise = $$props.promise;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theData, skillsHierarchy, skillsTree];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
