
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
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
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
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
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function tick() {
        schedule_update();
        return resolved_promise;
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
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

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
    const file$c = "src\\components\\CheckList.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i][0];
    	child_ctx[3] = list[i][1];
    	child_ctx[4] = list;
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (6:0) {#each Object.entries(items) as [key, item]}
    function create_each_block$5(ctx) {
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
    			add_location(input, file$c, 8, 3, 151);
    			add_location(label, file$c, 7, 2, 139);
    			attr_dev(span, "for", span_for_value = /*item*/ ctx[3].id);
    			attr_dev(span, "class", "svelte-86hf2g");
    			add_location(span, file$c, 6, 1, 115);
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
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(6:0) {#each Object.entries(items) as [key, item]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let each_value = Object.entries(/*items*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "checklists");
    			attr_dev(div, "class", "svelte-86hf2g");
    			add_location(div, file$c, 4, 0, 45);
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
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$d, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckList",
    			options,
    			id: create_fragment$d.name
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
    const file$b = "src\\components\\Skills.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i][0];
    	child_ctx[5] = list[i][1];
    	return child_ctx;
    }

    // (17:1) {#each Object.entries(skills) as [key, skill]}
    function create_each_block$4(ctx) {
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
    			add_location(input, file$b, 20, 3, 529);
    			add_location(label, file$b, 19, 2, 517);
    			attr_dev(span, "for", span_for_value = /*skill*/ ctx[5].id);
    			attr_dev(span, "id", span_id_value = /*skill*/ ctx[5].id);
    			attr_dev(span, "class", "svelte-1t6tr37");
    			toggle_class(span, "selected", /*selectedSkill*/ ctx[1].skillName == /*skill*/ ctx[5].skillName);
    			add_location(span, file$b, 17, 1, 408);
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(17:1) {#each Object.entries(skills) as [key, skill]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let t;
    	let checklist;
    	let current;
    	let each_value = Object.entries(/*skills*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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
    			add_location(div, file$b, 15, 0, 339);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$c, safe_not_equal, { skills: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$c.name
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
    const file$a = "src\\Components\\CheckListSelector.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i][0];
    	child_ctx[6] = list[i][1];
    	return child_ctx;
    }

    // (22:3) {#each Object.entries(data) as [key, area]}
    function create_each_block$3(ctx) {
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
    			add_location(input, file$a, 22, 4, 432);
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
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(22:3) {#each Object.entries(data) as [key, area]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
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
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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
    			add_location(div0, file$a, 20, 4, 362);
    			attr_dev(div1, "id", "area-detail");
    			attr_dev(div1, "class", "svelte-1edwinb");
    			add_location(div1, file$a, 25, 1, 554);
    			attr_dev(div2, "id", "checklist_item_selector");
    			add_location(div2, file$a, 19, 0, 322);
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
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$b, safe_not_equal, { skills: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CheckListSelector",
    			options,
    			id: create_fragment$b.name
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

    const file$9 = "src\\components\\SVGIcon.svelte";

    // (14:0) {:else}
    function create_else_block$1(ctx) {
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
    		id: create_else_block$1.name,
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
    			add_location(path, file$9, 12, 2, 413);
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
    function create_if_block_1$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");
    			add_location(path, file$9, 10, 2, 317);
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
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(10:34) ",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if name == "chevron-down"}
    function create_if_block$5(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z");
    			add_location(path, file$9, 8, 2, 215);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(8:0) {#if name == \\\"chevron-down\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let svg;
    	let svg_data_testid_value;

    	function select_block_type(ctx, dirty) {
    		if (/*name*/ ctx[0] == "chevron-down") return create_if_block$5;
    		if (/*name*/ ctx[0] == "chevron-right") return create_if_block_1$3;
    		if (/*name*/ ctx[0] == "blank") return create_if_block_2;
    		return create_else_block$1;
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
    			add_location(svg, file$9, 6, 0, 72);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$a, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SVGIcon",
    			options,
    			id: create_fragment$a.name
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
    const file$8 = "src\\Components\\TreeView.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (101:1) {#if shouldShowRoot()}
    function create_if_block_1$2(ctx) {
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
    			add_location(div, file$8, 101, 2, 2341);
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(101:1) {#if shouldShowRoot()}",
    		ctx
    	});

    	return block;
    }

    // (107:1) {#if !isLeaf() && branch.expanded}
    function create_if_block$4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*branch*/ ctx[0].items;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
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
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(107:1) {#if !isLeaf() && branch.expanded}",
    		ctx
    	});

    	return block;
    }

    // (108:2) {#each branch.items as item}
    function create_each_block$2(ctx) {
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(108:2) {#each branch.items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let show_if_1 = /*shouldShowRoot*/ ctx[7]();
    	let t;
    	let div;
    	let show_if = !/*isLeaf*/ ctx[5]() && /*branch*/ ctx[0].expanded;
    	let current;
    	let if_block0 = show_if_1 && create_if_block_1$2(ctx);
    	let if_block1 = show_if && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			div = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "svelte-1dft6r6");
    			toggle_class(div, "sub-group", /*shouldShowRoot*/ ctx[7]());
    			add_location(div, file$8, 105, 1, 2460);
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
    					if_block1 = create_if_block$4(ctx);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$6, create_fragment$9, safe_not_equal, {
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
    			id: create_fragment$9.name
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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCFoundation = /** @class */ (function () {
        function MDCFoundation(adapter) {
            if (adapter === void 0) { adapter = {}; }
            this.adapter = adapter;
        }
        Object.defineProperty(MDCFoundation, "cssClasses", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports every
                // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "strings", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "numbers", {
            get: function () {
                // Classes extending MDCFoundation should implement this method to return an object which exports all
                // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCFoundation, "defaultAdapter", {
            get: function () {
                // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
                // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
                // validation.
                return {};
            },
            enumerable: false,
            configurable: true
        });
        MDCFoundation.prototype.init = function () {
            // Subclasses should override this method to perform initialization routines (registering events, etc.)
        };
        MDCFoundation.prototype.destroy = function () {
            // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
        };
        return MDCFoundation;
    }());

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCComponent = /** @class */ (function () {
        function MDCComponent(root, foundation) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this.root = root;
            this.initialize.apply(this, __spreadArray([], __read(args)));
            // Note that we initialize foundation here and not within the constructor's
            // default param so that this.root is defined and can be used within the
            // foundation class.
            this.foundation =
                foundation === undefined ? this.getDefaultFoundation() : foundation;
            this.foundation.init();
            this.initialSyncWithDOM();
        }
        MDCComponent.attachTo = function (root) {
            // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
            // returns an instantiated component with its root set to that element. Also note that in the cases of
            // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
            // from getDefaultFoundation().
            return new MDCComponent(root, new MDCFoundation({}));
        };
        /* istanbul ignore next: method param only exists for typing purposes; it does not need to be unit tested */
        MDCComponent.prototype.initialize = function () {
            var _args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _args[_i] = arguments[_i];
            }
            // Subclasses can override this to do any additional setup work that would be considered part of a
            // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
            // initialized. Any additional arguments besides root and foundation will be passed in here.
        };
        MDCComponent.prototype.getDefaultFoundation = function () {
            // Subclasses must override this method to return a properly configured foundation class for the
            // component.
            throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
                'foundation class');
        };
        MDCComponent.prototype.initialSyncWithDOM = function () {
            // Subclasses should override this method if they need to perform work to synchronize with a host DOM
            // object. An example of this would be a form control wrapper that needs to synchronize its internal state
            // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
            // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
        };
        MDCComponent.prototype.destroy = function () {
            // Subclasses may implement this method to release any resources / deregister any listeners they have
            // attached. An example of this might be deregistering a resize event from the window object.
            this.foundation.destroy();
        };
        MDCComponent.prototype.listen = function (evtType, handler, options) {
            this.root.addEventListener(evtType, handler, options);
        };
        MDCComponent.prototype.unlisten = function (evtType, handler, options) {
            this.root.removeEventListener(evtType, handler, options);
        };
        /**
         * Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
         */
        MDCComponent.prototype.emit = function (evtType, evtData, shouldBubble) {
            if (shouldBubble === void 0) { shouldBubble = false; }
            var evt;
            if (typeof CustomEvent === 'function') {
                evt = new CustomEvent(evtType, {
                    bubbles: shouldBubble,
                    detail: evtData,
                });
            }
            else {
                evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(evtType, shouldBubble, false, evtData);
            }
            this.root.dispatchEvent(evt);
        };
        return MDCComponent;
    }());

    /**
     * @license
     * Copyright 2018 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
     * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
     */
    function closest(element, selector) {
        if (element.closest) {
            return element.closest(selector);
        }
        var el = element;
        while (el) {
            if (matches$1(el, selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }
    function matches$1(element, selector) {
        var nativeMatches = element.matches
            || element.webkitMatchesSelector
            || element.msMatchesSelector;
        return nativeMatches.call(element, selector);
    }
    /**
     * Used to compute the estimated scroll width of elements. When an element is
     * hidden due to display: none; being applied to a parent element, the width is
     * returned as 0. However, the element will have a true width once no longer
     * inside a display: none context. This method computes an estimated width when
     * the element is hidden or returns the true width when the element is visble.
     * @param {Element} element the element whose width to estimate
     */
    function estimateScrollWidth(element) {
        // Check the offsetParent. If the element inherits display: none from any
        // parent, the offsetParent property will be null (see
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
        // This check ensures we only clone the node when necessary.
        var htmlEl = element;
        if (htmlEl.offsetParent !== null) {
            return htmlEl.scrollWidth;
        }
        var clone = htmlEl.cloneNode(true);
        clone.style.setProperty('position', 'absolute');
        clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
        document.documentElement.appendChild(clone);
        var scrollWidth = clone.scrollWidth;
        document.documentElement.removeChild(clone);
        return scrollWidth;
    }

    var ponyfill = /*#__PURE__*/Object.freeze({
        __proto__: null,
        closest: closest,
        matches: matches$1,
        estimateScrollWidth: estimateScrollWidth
    });

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Determine whether the current browser supports passive event listeners, and
     * if so, use them.
     */
    function applyPassive$1(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        return supportsPassiveOption(globalObj) ?
            { passive: true } :
            false;
    }
    function supportsPassiveOption(globalObj) {
        if (globalObj === void 0) { globalObj = window; }
        // See
        // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        var passiveSupported = false;
        try {
            var options = {
                // This function will be called when the browser
                // attempts to access the passive property.
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            var handler = function () { };
            globalObj.document.addEventListener('test', handler, options);
            globalObj.document.removeEventListener('test', handler, options);
        }
        catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        applyPassive: applyPassive$1
    });

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var cssClasses$2 = {
        // Ripple is a special case where the "root" component is really a "mixin" of sorts,
        // given that it's an 'upgrade' to an existing component. That being said it is the root
        // CSS class that all other CSS classes derive from.
        BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
        FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
        FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
        ROOT: 'mdc-ripple-upgraded',
        UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
    };
    var strings$3 = {
        VAR_FG_SCALE: '--mdc-ripple-fg-scale',
        VAR_FG_SIZE: '--mdc-ripple-fg-size',
        VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
        VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
        VAR_LEFT: '--mdc-ripple-left',
        VAR_TOP: '--mdc-ripple-top',
    };
    var numbers = {
        DEACTIVATION_TIMEOUT_MS: 225,
        FG_DEACTIVATION_MS: 150,
        INITIAL_ORIGIN_SCALE: 0.6,
        PADDING: 10,
        TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
    };

    /**
     * Stores result from supportsCssVariables to avoid redundant processing to
     * detect CSS custom variable support.
     */
    var supportsCssVariables_;
    function supportsCssVariables(windowObj, forceRefresh) {
        if (forceRefresh === void 0) { forceRefresh = false; }
        var CSS = windowObj.CSS;
        var supportsCssVars = supportsCssVariables_;
        if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
            return supportsCssVariables_;
        }
        var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
        if (!supportsFunctionPresent) {
            return false;
        }
        var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
        // See: https://bugs.webkit.org/show_bug.cgi?id=154669
        // See: README section on Safari
        var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
            CSS.supports('color', '#00000000'));
        supportsCssVars =
            explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
        if (!forceRefresh) {
            supportsCssVariables_ = supportsCssVars;
        }
        return supportsCssVars;
    }
    function getNormalizedEventCoords(evt, pageOffset, clientRect) {
        if (!evt) {
            return { x: 0, y: 0 };
        }
        var x = pageOffset.x, y = pageOffset.y;
        var documentX = x + clientRect.left;
        var documentY = y + clientRect.top;
        var normalizedX;
        var normalizedY;
        // Determine touch point relative to the ripple container.
        if (evt.type === 'touchstart') {
            var touchEvent = evt;
            normalizedX = touchEvent.changedTouches[0].pageX - documentX;
            normalizedY = touchEvent.changedTouches[0].pageY - documentY;
        }
        else {
            var mouseEvent = evt;
            normalizedX = mouseEvent.pageX - documentX;
            normalizedY = mouseEvent.pageY - documentY;
        }
        return { x: normalizedX, y: normalizedY };
    }

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    // Activation events registered on the root element of each instance for activation
    var ACTIVATION_EVENT_TYPES = [
        'touchstart', 'pointerdown', 'mousedown', 'keydown',
    ];
    // Deactivation events registered on documentElement when a pointer-related down event occurs
    var POINTER_DEACTIVATION_EVENT_TYPES = [
        'touchend', 'pointerup', 'mouseup', 'contextmenu',
    ];
    // simultaneous nested activations
    var activatedTargets = [];
    var MDCRippleFoundation = /** @class */ (function (_super) {
        __extends(MDCRippleFoundation, _super);
        function MDCRippleFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
            _this.activationAnimationHasEnded = false;
            _this.activationTimer = 0;
            _this.fgDeactivationRemovalTimer = 0;
            _this.fgScale = '0';
            _this.frame = { width: 0, height: 0 };
            _this.initialSize = 0;
            _this.layoutFrame = 0;
            _this.maxRadius = 0;
            _this.unboundedCoords = { left: 0, top: 0 };
            _this.activationState = _this.defaultActivationState();
            _this.activationTimerCallback = function () {
                _this.activationAnimationHasEnded = true;
                _this.runDeactivationUXLogicIfReady();
            };
            _this.activateHandler = function (e) {
                _this.activateImpl(e);
            };
            _this.deactivateHandler = function () {
                _this.deactivateImpl();
            };
            _this.focusHandler = function () {
                _this.handleFocus();
            };
            _this.blurHandler = function () {
                _this.handleBlur();
            };
            _this.resizeHandler = function () {
                _this.layout();
            };
            return _this;
        }
        Object.defineProperty(MDCRippleFoundation, "cssClasses", {
            get: function () {
                return cssClasses$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "strings", {
            get: function () {
                return strings$3;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "numbers", {
            get: function () {
                return numbers;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    browserSupportsCssVars: function () { return true; },
                    computeBoundingRect: function () {
                        return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                    },
                    containsEventTarget: function () { return true; },
                    deregisterDocumentInteractionHandler: function () { return undefined; },
                    deregisterInteractionHandler: function () { return undefined; },
                    deregisterResizeHandler: function () { return undefined; },
                    getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                    isSurfaceActive: function () { return true; },
                    isSurfaceDisabled: function () { return true; },
                    isUnbounded: function () { return true; },
                    registerDocumentInteractionHandler: function () { return undefined; },
                    registerInteractionHandler: function () { return undefined; },
                    registerResizeHandler: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    updateCssVariable: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCRippleFoundation.prototype.init = function () {
            var _this = this;
            var supportsPressRipple = this.supportsPressRipple();
            this.registerRootHandlers(supportsPressRipple);
            if (supportsPressRipple) {
                var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.addClass(ROOT_1);
                    if (_this.adapter.isUnbounded()) {
                        _this.adapter.addClass(UNBOUNDED_1);
                        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                        _this.layoutInternal();
                    }
                });
            }
        };
        MDCRippleFoundation.prototype.destroy = function () {
            var _this = this;
            if (this.supportsPressRipple()) {
                if (this.activationTimer) {
                    clearTimeout(this.activationTimer);
                    this.activationTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
                }
                if (this.fgDeactivationRemovalTimer) {
                    clearTimeout(this.fgDeactivationRemovalTimer);
                    this.fgDeactivationRemovalTimer = 0;
                    this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
                }
                var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
                requestAnimationFrame(function () {
                    _this.adapter.removeClass(ROOT_2);
                    _this.adapter.removeClass(UNBOUNDED_2);
                    _this.removeCssVars();
                });
            }
            this.deregisterRootHandlers();
            this.deregisterDeactivationHandlers();
        };
        /**
         * @param evt Optional event containing position information.
         */
        MDCRippleFoundation.prototype.activate = function (evt) {
            this.activateImpl(evt);
        };
        MDCRippleFoundation.prototype.deactivate = function () {
            this.deactivateImpl();
        };
        MDCRippleFoundation.prototype.layout = function () {
            var _this = this;
            if (this.layoutFrame) {
                cancelAnimationFrame(this.layoutFrame);
            }
            this.layoutFrame = requestAnimationFrame(function () {
                _this.layoutInternal();
                _this.layoutFrame = 0;
            });
        };
        MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
            var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
            if (unbounded) {
                this.adapter.addClass(UNBOUNDED);
            }
            else {
                this.adapter.removeClass(UNBOUNDED);
            }
        };
        MDCRippleFoundation.prototype.handleFocus = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        MDCRippleFoundation.prototype.handleBlur = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
        };
        /**
         * We compute this property so that we are not querying information about the client
         * until the point in time where the foundation requests it. This prevents scenarios where
         * client-side feature-detection may happen too early, such as when components are rendered on the server
         * and then initialized at mount time on the client.
         */
        MDCRippleFoundation.prototype.supportsPressRipple = function () {
            return this.adapter.browserSupportsCssVars();
        };
        MDCRippleFoundation.prototype.defaultActivationState = function () {
            return {
                activationEvent: undefined,
                hasDeactivationUXRun: false,
                isActivated: false,
                isProgrammatic: false,
                wasActivatedByPointer: false,
                wasElementMadeActive: false,
            };
        };
        /**
         * supportsPressRipple Passed from init to save a redundant function call
         */
        MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
            var e_1, _a;
            if (supportsPressRipple) {
                try {
                    for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (this.adapter.isUnbounded()) {
                    this.adapter.registerResizeHandler(this.resizeHandler);
                }
            }
            this.adapter.registerInteractionHandler('focus', this.focusHandler);
            this.adapter.registerInteractionHandler('blur', this.blurHandler);
        };
        MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
            var e_2, _a;
            if (evt.type === 'keydown') {
                this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
            }
            else {
                try {
                    for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                        var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                        this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
            var e_3, _a;
            try {
                for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
            this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
            if (this.adapter.isUnbounded()) {
                this.adapter.deregisterResizeHandler(this.resizeHandler);
            }
        };
        MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
            var e_4, _a;
            this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                    this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        MDCRippleFoundation.prototype.removeCssVars = function () {
            var _this = this;
            var rippleStrings = MDCRippleFoundation.strings;
            var keys = Object.keys(rippleStrings);
            keys.forEach(function (key) {
                if (key.indexOf('VAR_') === 0) {
                    _this.adapter.updateCssVariable(rippleStrings[key], null);
                }
            });
        };
        MDCRippleFoundation.prototype.activateImpl = function (evt) {
            var _this = this;
            if (this.adapter.isSurfaceDisabled()) {
                return;
            }
            var activationState = this.activationState;
            if (activationState.isActivated) {
                return;
            }
            // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
            var previousActivationEvent = this.previousActivationEvent;
            var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
            if (isSameInteraction) {
                return;
            }
            activationState.isActivated = true;
            activationState.isProgrammatic = evt === undefined;
            activationState.activationEvent = evt;
            activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
            var hasActivatedChild = evt !== undefined &&
                activatedTargets.length > 0 &&
                activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
            if (hasActivatedChild) {
                // Immediately reset activation state, while preserving logic that prevents touch follow-on events
                this.resetActivationState();
                return;
            }
            if (evt !== undefined) {
                activatedTargets.push(evt.target);
                this.registerDeactivationHandlers(evt);
            }
            activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
            if (activationState.wasElementMadeActive) {
                this.animateActivation();
            }
            requestAnimationFrame(function () {
                // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
                activatedTargets = [];
                if (!activationState.wasElementMadeActive
                    && evt !== undefined
                    && (evt.key === ' ' || evt.keyCode === 32)) {
                    // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                    // active states inconsistently when they're called within event handling code:
                    // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                    // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                    // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                    // variable is set within a rAF callback for a submit button interaction (#2241).
                    activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                    if (activationState.wasElementMadeActive) {
                        _this.animateActivation();
                    }
                }
                if (!activationState.wasElementMadeActive) {
                    // Reset activation state immediately if element was not made active.
                    _this.activationState = _this.defaultActivationState();
                }
            });
        };
        MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
            return (evt !== undefined && evt.type === 'keydown') ?
                this.adapter.isSurfaceActive() :
                true;
        };
        MDCRippleFoundation.prototype.animateActivation = function () {
            var _this = this;
            var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
            var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
            var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
            this.layoutInternal();
            var translateStart = '';
            var translateEnd = '';
            if (!this.adapter.isUnbounded()) {
                var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
                translateStart = startPoint.x + "px, " + startPoint.y + "px";
                translateEnd = endPoint.x + "px, " + endPoint.y + "px";
            }
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
            this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
            // Cancel any ongoing activation/deactivation animations
            clearTimeout(this.activationTimer);
            clearTimeout(this.fgDeactivationRemovalTimer);
            this.rmBoundedActivationClasses();
            this.adapter.removeClass(FG_DEACTIVATION);
            // Force layout in order to re-trigger the animation.
            this.adapter.computeBoundingRect();
            this.adapter.addClass(FG_ACTIVATION);
            this.activationTimer = setTimeout(function () {
                _this.activationTimerCallback();
            }, DEACTIVATION_TIMEOUT_MS);
        };
        MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
            var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
            var startPoint;
            if (wasActivatedByPointer) {
                startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
            }
            else {
                startPoint = {
                    x: this.frame.width / 2,
                    y: this.frame.height / 2,
                };
            }
            // Center the element around the start point.
            startPoint = {
                x: startPoint.x - (this.initialSize / 2),
                y: startPoint.y - (this.initialSize / 2),
            };
            var endPoint = {
                x: (this.frame.width / 2) - (this.initialSize / 2),
                y: (this.frame.height / 2) - (this.initialSize / 2),
            };
            return { startPoint: startPoint, endPoint: endPoint };
        };
        MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
            var _this = this;
            // This method is called both when a pointing device is released, and when the activation animation ends.
            // The deactivation animation should only run after both of those occur.
            var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
            var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
            var activationHasEnded = hasDeactivationUXRun || !isActivated;
            if (activationHasEnded && this.activationAnimationHasEnded) {
                this.rmBoundedActivationClasses();
                this.adapter.addClass(FG_DEACTIVATION);
                this.fgDeactivationRemovalTimer = setTimeout(function () {
                    _this.adapter.removeClass(FG_DEACTIVATION);
                }, numbers.FG_DEACTIVATION_MS);
            }
        };
        MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
            var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
            this.adapter.removeClass(FG_ACTIVATION);
            this.activationAnimationHasEnded = false;
            this.adapter.computeBoundingRect();
        };
        MDCRippleFoundation.prototype.resetActivationState = function () {
            var _this = this;
            this.previousActivationEvent = this.activationState.activationEvent;
            this.activationState = this.defaultActivationState();
            // Touch devices may fire additional events for the same interaction within a short time.
            // Store the previous event until it's safe to assume that subsequent events are for new interactions.
            setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
        };
        MDCRippleFoundation.prototype.deactivateImpl = function () {
            var _this = this;
            var activationState = this.activationState;
            // This can happen in scenarios such as when you have a keyup event that blurs the element.
            if (!activationState.isActivated) {
                return;
            }
            var state = __assign({}, activationState);
            if (activationState.isProgrammatic) {
                requestAnimationFrame(function () {
                    _this.animateDeactivation(state);
                });
                this.resetActivationState();
            }
            else {
                this.deregisterDeactivationHandlers();
                requestAnimationFrame(function () {
                    _this.activationState.hasDeactivationUXRun = true;
                    _this.animateDeactivation(state);
                    _this.resetActivationState();
                });
            }
        };
        MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
            var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
            if (wasActivatedByPointer || wasElementMadeActive) {
                this.runDeactivationUXLogicIfReady();
            }
        };
        MDCRippleFoundation.prototype.layoutInternal = function () {
            var _this = this;
            this.frame = this.adapter.computeBoundingRect();
            var maxDim = Math.max(this.frame.height, this.frame.width);
            // Surface diameter is treated differently for unbounded vs. bounded ripples.
            // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
            // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
            // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
            // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
            // `overflow: hidden`.
            var getBoundedRadius = function () {
                var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
                return hypotenuse + MDCRippleFoundation.numbers.PADDING;
            };
            this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
            // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
            var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
            // Unbounded ripple size should always be even number to equally center align.
            if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
                this.initialSize = initialSize - 1;
            }
            else {
                this.initialSize = initialSize;
            }
            this.fgScale = "" + this.maxRadius / this.initialSize;
            this.updateLayoutCssVars();
        };
        MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
            var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
            this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
            this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
            if (this.adapter.isUnbounded()) {
                this.unboundedCoords = {
                    left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                    top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
                };
                this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
                this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
            }
        };
        return MDCRippleFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCRipple = /** @class */ (function (_super) {
        __extends(MDCRipple, _super);
        function MDCRipple() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.disabled = false;
            return _this;
        }
        MDCRipple.attachTo = function (root, opts) {
            if (opts === void 0) { opts = {
                isUnbounded: undefined
            }; }
            var ripple = new MDCRipple(root);
            // Only override unbounded behavior if option is explicitly specified
            if (opts.isUnbounded !== undefined) {
                ripple.unbounded = opts.isUnbounded;
            }
            return ripple;
        };
        MDCRipple.createAdapter = function (instance) {
            return {
                addClass: function (className) { return instance.root.classList.add(className); },
                browserSupportsCssVars: function () { return supportsCssVariables(window); },
                computeBoundingRect: function () { return instance.root.getBoundingClientRect(); },
                containsEventTarget: function (target) { return instance.root.contains(target); },
                deregisterDocumentInteractionHandler: function (evtType, handler) {
                    return document.documentElement.removeEventListener(evtType, handler, applyPassive$1());
                },
                deregisterInteractionHandler: function (evtType, handler) {
                    return instance.root
                        .removeEventListener(evtType, handler, applyPassive$1());
                },
                deregisterResizeHandler: function (handler) {
                    return window.removeEventListener('resize', handler);
                },
                getWindowPageOffset: function () {
                    return ({ x: window.pageXOffset, y: window.pageYOffset });
                },
                isSurfaceActive: function () { return matches$1(instance.root, ':active'); },
                isSurfaceDisabled: function () { return Boolean(instance.disabled); },
                isUnbounded: function () { return Boolean(instance.unbounded); },
                registerDocumentInteractionHandler: function (evtType, handler) {
                    return document.documentElement.addEventListener(evtType, handler, applyPassive$1());
                },
                registerInteractionHandler: function (evtType, handler) {
                    return instance.root
                        .addEventListener(evtType, handler, applyPassive$1());
                },
                registerResizeHandler: function (handler) {
                    return window.addEventListener('resize', handler);
                },
                removeClass: function (className) { return instance.root.classList.remove(className); },
                updateCssVariable: function (varName, value) {
                    return instance.root.style.setProperty(varName, value);
                },
            };
        };
        Object.defineProperty(MDCRipple.prototype, "unbounded", {
            get: function () {
                return Boolean(this.isUnbounded);
            },
            set: function (unbounded) {
                this.isUnbounded = Boolean(unbounded);
                this.setUnbounded();
            },
            enumerable: false,
            configurable: true
        });
        MDCRipple.prototype.activate = function () {
            this.foundation.activate();
        };
        MDCRipple.prototype.deactivate = function () {
            this.foundation.deactivate();
        };
        MDCRipple.prototype.layout = function () {
            this.foundation.layout();
        };
        MDCRipple.prototype.getDefaultFoundation = function () {
            return new MDCRippleFoundation(MDCRipple.createAdapter(this));
        };
        MDCRipple.prototype.initialSyncWithDOM = function () {
            var root = this.root;
            this.isUnbounded = 'mdcRippleIsUnbounded' in root.dataset;
        };
        /**
         * Closure Compiler throws an access control error when directly accessing a
         * protected or private property inside a getter/setter, like unbounded above.
         * By accessing the protected property inside a method, we solve that problem.
         * That's why this function exists.
         */
        MDCRipple.prototype.setUnbounded = function () {
            this.foundation.setUnbounded(Boolean(this.isUnbounded));
        };
        return MDCRipple;
    }(MDCComponent));

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * KEY provides normalized string values for keys.
     */
    var KEY = {
        UNKNOWN: 'Unknown',
        BACKSPACE: 'Backspace',
        ENTER: 'Enter',
        SPACEBAR: 'Spacebar',
        PAGE_UP: 'PageUp',
        PAGE_DOWN: 'PageDown',
        END: 'End',
        HOME: 'Home',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_UP: 'ArrowUp',
        ARROW_RIGHT: 'ArrowRight',
        ARROW_DOWN: 'ArrowDown',
        DELETE: 'Delete',
        ESCAPE: 'Escape',
        TAB: 'Tab',
    };
    var normalizedKeys = new Set();
    // IE11 has no support for new Map with iterable so we need to initialize this
    // by hand.
    normalizedKeys.add(KEY.BACKSPACE);
    normalizedKeys.add(KEY.ENTER);
    normalizedKeys.add(KEY.SPACEBAR);
    normalizedKeys.add(KEY.PAGE_UP);
    normalizedKeys.add(KEY.PAGE_DOWN);
    normalizedKeys.add(KEY.END);
    normalizedKeys.add(KEY.HOME);
    normalizedKeys.add(KEY.ARROW_LEFT);
    normalizedKeys.add(KEY.ARROW_UP);
    normalizedKeys.add(KEY.ARROW_RIGHT);
    normalizedKeys.add(KEY.ARROW_DOWN);
    normalizedKeys.add(KEY.DELETE);
    normalizedKeys.add(KEY.ESCAPE);
    normalizedKeys.add(KEY.TAB);
    var KEY_CODE = {
        BACKSPACE: 8,
        ENTER: 13,
        SPACEBAR: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        DELETE: 46,
        ESCAPE: 27,
        TAB: 9,
    };
    var mappedKeyCodes = new Map();
    // IE11 has no support for new Map with iterable so we need to initialize this
    // by hand.
    mappedKeyCodes.set(KEY_CODE.BACKSPACE, KEY.BACKSPACE);
    mappedKeyCodes.set(KEY_CODE.ENTER, KEY.ENTER);
    mappedKeyCodes.set(KEY_CODE.SPACEBAR, KEY.SPACEBAR);
    mappedKeyCodes.set(KEY_CODE.PAGE_UP, KEY.PAGE_UP);
    mappedKeyCodes.set(KEY_CODE.PAGE_DOWN, KEY.PAGE_DOWN);
    mappedKeyCodes.set(KEY_CODE.END, KEY.END);
    mappedKeyCodes.set(KEY_CODE.HOME, KEY.HOME);
    mappedKeyCodes.set(KEY_CODE.ARROW_LEFT, KEY.ARROW_LEFT);
    mappedKeyCodes.set(KEY_CODE.ARROW_UP, KEY.ARROW_UP);
    mappedKeyCodes.set(KEY_CODE.ARROW_RIGHT, KEY.ARROW_RIGHT);
    mappedKeyCodes.set(KEY_CODE.ARROW_DOWN, KEY.ARROW_DOWN);
    mappedKeyCodes.set(KEY_CODE.DELETE, KEY.DELETE);
    mappedKeyCodes.set(KEY_CODE.ESCAPE, KEY.ESCAPE);
    mappedKeyCodes.set(KEY_CODE.TAB, KEY.TAB);
    var navigationKeys$1 = new Set();
    // IE11 has no support for new Set with iterable so we need to initialize this
    // by hand.
    navigationKeys$1.add(KEY.PAGE_UP);
    navigationKeys$1.add(KEY.PAGE_DOWN);
    navigationKeys$1.add(KEY.END);
    navigationKeys$1.add(KEY.HOME);
    navigationKeys$1.add(KEY.ARROW_LEFT);
    navigationKeys$1.add(KEY.ARROW_UP);
    navigationKeys$1.add(KEY.ARROW_RIGHT);
    navigationKeys$1.add(KEY.ARROW_DOWN);
    /**
     * normalizeKey returns the normalized string for a navigational action.
     */
    function normalizeKey(evt) {
        var key = evt.key;
        // If the event already has a normalized key, return it
        if (normalizedKeys.has(key)) {
            return key;
        }
        // tslint:disable-next-line:deprecation
        var mappedKey = mappedKeyCodes.get(evt.keyCode);
        if (mappedKey) {
            return mappedKey;
        }
        return KEY.UNKNOWN;
    }
    /**
     * isNavigationEvent returns whether the event is a navigation event
     */
    function isNavigationEvent(evt) {
        return navigationKeys$1.has(normalizeKey(evt));
    }

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    /**
     * Priorities for the announce function.
     */
    var AnnouncerPriority;
    (function (AnnouncerPriority) {
        AnnouncerPriority["POLITE"] = "polite";
        AnnouncerPriority["ASSERTIVE"] = "assertive";
    })(AnnouncerPriority || (AnnouncerPriority = {}));
    /**
     * Data attribute added to live region element.
     */
    var DATA_MDC_DOM_ANNOUNCE = 'data-mdc-dom-announce';
    /**
     * Announces the given message with optional priority, defaulting to "polite"
     */
    function announce$1(message, options) {
        Announcer.getInstance().say(message, options);
    }
    var Announcer = /** @class */ (function () {
        // Constructor made private to ensure only the singleton is used
        function Announcer() {
            this.liveRegions = new Map();
        }
        Announcer.getInstance = function () {
            if (!Announcer.instance) {
                Announcer.instance = new Announcer();
            }
            return Announcer.instance;
        };
        Announcer.prototype.say = function (message, options) {
            var _a, _b;
            var priority = (_a = options === null || options === void 0 ? void 0 : options.priority) !== null && _a !== void 0 ? _a : AnnouncerPriority.POLITE;
            var ownerDocument = (_b = options === null || options === void 0 ? void 0 : options.ownerDocument) !== null && _b !== void 0 ? _b : document;
            var liveRegion = this.getLiveRegion(priority, ownerDocument);
            // Reset the region to pick up the message, even if the message is the
            // exact same as before.
            liveRegion.textContent = '';
            // Timeout is necessary for screen readers like NVDA and VoiceOver.
            setTimeout(function () {
                liveRegion.textContent = message;
                ownerDocument.addEventListener('click', clearLiveRegion);
            }, 1);
            function clearLiveRegion() {
                liveRegion.textContent = '';
                ownerDocument.removeEventListener('click', clearLiveRegion);
            }
        };
        Announcer.prototype.getLiveRegion = function (priority, ownerDocument) {
            var documentLiveRegions = this.liveRegions.get(ownerDocument);
            if (!documentLiveRegions) {
                documentLiveRegions = new Map();
                this.liveRegions.set(ownerDocument, documentLiveRegions);
            }
            var existingLiveRegion = documentLiveRegions.get(priority);
            if (existingLiveRegion &&
                ownerDocument.body.contains(existingLiveRegion)) {
                return existingLiveRegion;
            }
            var liveRegion = this.createLiveRegion(priority, ownerDocument);
            documentLiveRegions.set(priority, liveRegion);
            return liveRegion;
        };
        Announcer.prototype.createLiveRegion = function (priority, ownerDocument) {
            var el = ownerDocument.createElement('div');
            el.style.position = 'absolute';
            el.style.top = '-9999px';
            el.style.left = '-9999px';
            el.style.height = '1px';
            el.style.overflow = 'hidden';
            el.setAttribute('aria-atomic', 'true');
            el.setAttribute('aria-live', priority);
            el.setAttribute(DATA_MDC_DOM_ANNOUNCE, 'true');
            ownerDocument.body.appendChild(el);
            return el;
        };
        return Announcer;
    }());

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var InteractionTrigger;
    (function (InteractionTrigger) {
        InteractionTrigger[InteractionTrigger["UNSPECIFIED"] = 0] = "UNSPECIFIED";
        InteractionTrigger[InteractionTrigger["CLICK"] = 1] = "CLICK";
        InteractionTrigger[InteractionTrigger["BACKSPACE_KEY"] = 2] = "BACKSPACE_KEY";
        InteractionTrigger[InteractionTrigger["DELETE_KEY"] = 3] = "DELETE_KEY";
        InteractionTrigger[InteractionTrigger["SPACEBAR_KEY"] = 4] = "SPACEBAR_KEY";
        InteractionTrigger[InteractionTrigger["ENTER_KEY"] = 5] = "ENTER_KEY";
    })(InteractionTrigger || (InteractionTrigger = {}));
    var strings$2 = {
        ARIA_HIDDEN: 'aria-hidden',
        INTERACTION_EVENT: 'MDCChipTrailingAction:interaction',
        NAVIGATION_EVENT: 'MDCChipTrailingAction:navigation',
        TAB_INDEX: 'tabindex',
    };

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCChipTrailingActionFoundation = /** @class */ (function (_super) {
        __extends(MDCChipTrailingActionFoundation, _super);
        function MDCChipTrailingActionFoundation(adapter) {
            return _super.call(this, __assign(__assign({}, MDCChipTrailingActionFoundation.defaultAdapter), adapter)) || this;
        }
        Object.defineProperty(MDCChipTrailingActionFoundation, "strings", {
            get: function () {
                return strings$2;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChipTrailingActionFoundation, "defaultAdapter", {
            get: function () {
                return {
                    focus: function () { return undefined; },
                    getAttribute: function () { return null; },
                    setAttribute: function () { return undefined; },
                    notifyInteraction: function () { return undefined; },
                    notifyNavigation: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCChipTrailingActionFoundation.prototype.handleClick = function (evt) {
            evt.stopPropagation();
            this.adapter.notifyInteraction(InteractionTrigger.CLICK);
        };
        MDCChipTrailingActionFoundation.prototype.handleKeydown = function (evt) {
            evt.stopPropagation();
            var key = normalizeKey(evt);
            if (this.shouldNotifyInteractionFromKey(key)) {
                var trigger = this.getTriggerFromKey(key);
                this.adapter.notifyInteraction(trigger);
                return;
            }
            if (isNavigationEvent(evt)) {
                this.adapter.notifyNavigation(key);
                return;
            }
        };
        MDCChipTrailingActionFoundation.prototype.removeFocus = function () {
            this.adapter.setAttribute(strings$2.TAB_INDEX, '-1');
        };
        MDCChipTrailingActionFoundation.prototype.focus = function () {
            this.adapter.setAttribute(strings$2.TAB_INDEX, '0');
            this.adapter.focus();
        };
        MDCChipTrailingActionFoundation.prototype.isNavigable = function () {
            return this.adapter.getAttribute(strings$2.ARIA_HIDDEN) !== 'true';
        };
        MDCChipTrailingActionFoundation.prototype.shouldNotifyInteractionFromKey = function (key) {
            var isFromActionKey = key === KEY.ENTER || key === KEY.SPACEBAR;
            var isFromDeleteKey = key === KEY.BACKSPACE || key === KEY.DELETE;
            return isFromActionKey || isFromDeleteKey;
        };
        MDCChipTrailingActionFoundation.prototype.getTriggerFromKey = function (key) {
            if (key === KEY.SPACEBAR) {
                return InteractionTrigger.SPACEBAR_KEY;
            }
            if (key === KEY.ENTER) {
                return InteractionTrigger.ENTER_KEY;
            }
            if (key === KEY.DELETE) {
                return InteractionTrigger.DELETE_KEY;
            }
            if (key === KEY.BACKSPACE) {
                return InteractionTrigger.BACKSPACE_KEY;
            }
            // Default case, should never be returned
            return InteractionTrigger.UNSPECIFIED;
        };
        return MDCChipTrailingActionFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2020 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCChipTrailingAction = /** @class */ (function (_super) {
        __extends(MDCChipTrailingAction, _super);
        function MDCChipTrailingAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MDCChipTrailingAction.prototype, "ripple", {
            get: function () {
                return this.rippleSurface;
            },
            enumerable: false,
            configurable: true
        });
        MDCChipTrailingAction.attachTo = function (root) {
            return new MDCChipTrailingAction(root);
        };
        MDCChipTrailingAction.prototype.initialize = function (rippleFactory) {
            if (rippleFactory === void 0) { rippleFactory = function (el, foundation) {
                return new MDCRipple(el, foundation);
            }; }
            // DO NOT INLINE this variable. For backward compatibility, foundations take
            // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
            // methods, we need a separate, strongly typed adapter variable.
            var rippleAdapter = MDCRipple.createAdapter(this);
            this.rippleSurface =
                rippleFactory(this.root, new MDCRippleFoundation(rippleAdapter));
        };
        MDCChipTrailingAction.prototype.initialSyncWithDOM = function () {
            var _this = this;
            this.handleClick = function (evt) {
                _this.foundation.handleClick(evt);
            };
            this.handleKeydown = function (evt) {
                _this.foundation.handleKeydown(evt);
            };
            this.listen('click', this.handleClick);
            this.listen('keydown', this.handleKeydown);
        };
        MDCChipTrailingAction.prototype.destroy = function () {
            this.rippleSurface.destroy();
            this.unlisten('click', this.handleClick);
            this.unlisten('keydown', this.handleKeydown);
            _super.prototype.destroy.call(this);
        };
        MDCChipTrailingAction.prototype.getDefaultFoundation = function () {
            var _this = this;
            // DO NOT INLINE this variable. For backward compatibility, foundations take
            // a Partial<MDCFooAdapter>. To ensure we don't accidentally omit any
            // methods, we need a separate, strongly typed adapter variable.
            var adapter = {
                focus: function () {
                    // TODO(b/157231863): Migate MDCComponent#root to HTMLElement
                    _this.root.focus();
                },
                getAttribute: function (attr) { return _this.root.getAttribute(attr); },
                notifyInteraction: function (trigger) {
                    return _this.emit(strings$2.INTERACTION_EVENT, { trigger: trigger }, true /* shouldBubble */);
                },
                notifyNavigation: function (key) {
                    _this.emit(strings$2.NAVIGATION_EVENT, { key: key }, true /* shouldBubble */);
                },
                setAttribute: function (attr, value) {
                    _this.root.setAttribute(attr, value);
                },
            };
            return new MDCChipTrailingActionFoundation(adapter);
        };
        MDCChipTrailingAction.prototype.isNavigable = function () {
            return this.foundation.isNavigable();
        };
        MDCChipTrailingAction.prototype.focus = function () {
            this.foundation.focus();
        };
        MDCChipTrailingAction.prototype.removeFocus = function () {
            this.foundation.removeFocus();
        };
        return MDCChipTrailingAction;
    }(MDCComponent));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var Direction;
    (function (Direction) {
        Direction["LEFT"] = "left";
        Direction["RIGHT"] = "right";
    })(Direction || (Direction = {}));
    var EventSource;
    (function (EventSource) {
        EventSource["PRIMARY"] = "primary";
        EventSource["TRAILING"] = "trailing";
        EventSource["NONE"] = "none";
    })(EventSource || (EventSource = {}));
    var strings$1 = {
        ADDED_ANNOUNCEMENT_ATTRIBUTE: 'data-mdc-chip-added-announcement',
        ARIA_CHECKED: 'aria-checked',
        ARROW_DOWN_KEY: 'ArrowDown',
        ARROW_LEFT_KEY: 'ArrowLeft',
        ARROW_RIGHT_KEY: 'ArrowRight',
        ARROW_UP_KEY: 'ArrowUp',
        BACKSPACE_KEY: 'Backspace',
        CHECKMARK_SELECTOR: '.mdc-chip__checkmark',
        DELETE_KEY: 'Delete',
        END_KEY: 'End',
        ENTER_KEY: 'Enter',
        ENTRY_ANIMATION_NAME: 'mdc-chip-entry',
        HOME_KEY: 'Home',
        IE_ARROW_DOWN_KEY: 'Down',
        IE_ARROW_LEFT_KEY: 'Left',
        IE_ARROW_RIGHT_KEY: 'Right',
        IE_ARROW_UP_KEY: 'Up',
        IE_DELETE_KEY: 'Del',
        INTERACTION_EVENT: 'MDCChip:interaction',
        LEADING_ICON_SELECTOR: '.mdc-chip__icon--leading',
        NAVIGATION_EVENT: 'MDCChip:navigation',
        PRIMARY_ACTION_SELECTOR: '.mdc-chip__primary-action',
        REMOVED_ANNOUNCEMENT_ATTRIBUTE: 'data-mdc-chip-removed-announcement',
        REMOVAL_EVENT: 'MDCChip:removal',
        SELECTION_EVENT: 'MDCChip:selection',
        SPACEBAR_KEY: ' ',
        TAB_INDEX: 'tabindex',
        TRAILING_ACTION_SELECTOR: '.mdc-chip-trailing-action',
        TRAILING_ICON_INTERACTION_EVENT: 'MDCChip:trailingIconInteraction',
        TRAILING_ICON_SELECTOR: '.mdc-chip__icon--trailing',
    };
    var cssClasses$1 = {
        CHECKMARK: 'mdc-chip__checkmark',
        CHIP_EXIT: 'mdc-chip--exit',
        DELETABLE: 'mdc-chip--deletable',
        EDITABLE: 'mdc-chip--editable',
        EDITING: 'mdc-chip--editing',
        HIDDEN_LEADING_ICON: 'mdc-chip__icon--leading-hidden',
        LEADING_ICON: 'mdc-chip__icon--leading',
        PRIMARY_ACTION: 'mdc-chip__primary-action',
        PRIMARY_ACTION_FOCUSED: 'mdc-chip--primary-action-focused',
        SELECTED: 'mdc-chip--selected',
        TEXT: 'mdc-chip__text',
        TRAILING_ACTION: 'mdc-chip__trailing-action',
        TRAILING_ICON: 'mdc-chip__icon--trailing',
    };
    var navigationKeys = new Set();
    // IE11 has no support for new Set with iterable so we need to initialize this by hand
    navigationKeys.add(strings$1.ARROW_LEFT_KEY);
    navigationKeys.add(strings$1.ARROW_RIGHT_KEY);
    navigationKeys.add(strings$1.ARROW_DOWN_KEY);
    navigationKeys.add(strings$1.ARROW_UP_KEY);
    navigationKeys.add(strings$1.END_KEY);
    navigationKeys.add(strings$1.HOME_KEY);
    navigationKeys.add(strings$1.IE_ARROW_LEFT_KEY);
    navigationKeys.add(strings$1.IE_ARROW_RIGHT_KEY);
    navigationKeys.add(strings$1.IE_ARROW_DOWN_KEY);
    navigationKeys.add(strings$1.IE_ARROW_UP_KEY);
    var jumpChipKeys = new Set();
    // IE11 has no support for new Set with iterable so we need to initialize this by hand
    jumpChipKeys.add(strings$1.ARROW_UP_KEY);
    jumpChipKeys.add(strings$1.ARROW_DOWN_KEY);
    jumpChipKeys.add(strings$1.HOME_KEY);
    jumpChipKeys.add(strings$1.END_KEY);
    jumpChipKeys.add(strings$1.IE_ARROW_UP_KEY);
    jumpChipKeys.add(strings$1.IE_ARROW_DOWN_KEY);

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var emptyClientRect = {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
    };
    var FocusBehavior;
    (function (FocusBehavior) {
        FocusBehavior[FocusBehavior["SHOULD_FOCUS"] = 0] = "SHOULD_FOCUS";
        FocusBehavior[FocusBehavior["SHOULD_NOT_FOCUS"] = 1] = "SHOULD_NOT_FOCUS";
    })(FocusBehavior || (FocusBehavior = {}));
    var MDCChipFoundation = /** @class */ (function (_super) {
        __extends(MDCChipFoundation, _super);
        function MDCChipFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCChipFoundation.defaultAdapter), adapter)) || this;
            /** Whether a trailing icon click should immediately trigger exit/removal of the chip. */
            _this.shouldRemoveOnTrailingIconClick = true;
            /**
             * Whether the primary action should receive focus on click. Should only be
             * set to true for clients who programmatically give focus to a different
             * element on the page when a chip is clicked (like a menu).
             */
            _this.shouldFocusPrimaryActionOnClick = true;
            return _this;
        }
        Object.defineProperty(MDCChipFoundation, "strings", {
            get: function () {
                return strings$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChipFoundation, "cssClasses", {
            get: function () {
                return cssClasses$1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChipFoundation, "defaultAdapter", {
            get: function () {
                return {
                    addClass: function () { return undefined; },
                    addClassToLeadingIcon: function () { return undefined; },
                    eventTargetHasClass: function () { return false; },
                    focusPrimaryAction: function () { return undefined; },
                    focusTrailingAction: function () { return undefined; },
                    getAttribute: function () { return null; },
                    getCheckmarkBoundingClientRect: function () { return emptyClientRect; },
                    getComputedStyleValue: function () { return ''; },
                    getRootBoundingClientRect: function () { return emptyClientRect; },
                    hasClass: function () { return false; },
                    hasLeadingIcon: function () { return false; },
                    isRTL: function () { return false; },
                    isTrailingActionNavigable: function () { return false; },
                    notifyEditFinish: function () { return undefined; },
                    notifyEditStart: function () { return undefined; },
                    notifyInteraction: function () { return undefined; },
                    notifyNavigation: function () { return undefined; },
                    notifyRemoval: function () { return undefined; },
                    notifySelection: function () { return undefined; },
                    notifyTrailingIconInteraction: function () { return undefined; },
                    removeClass: function () { return undefined; },
                    removeClassFromLeadingIcon: function () { return undefined; },
                    removeTrailingActionFocus: function () { return undefined; },
                    setPrimaryActionAttr: function () { return undefined; },
                    setStyleProperty: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        MDCChipFoundation.prototype.isSelected = function () {
            return this.adapter.hasClass(cssClasses$1.SELECTED);
        };
        MDCChipFoundation.prototype.isEditable = function () {
            return this.adapter.hasClass(cssClasses$1.EDITABLE);
        };
        MDCChipFoundation.prototype.isEditing = function () {
            return this.adapter.hasClass(cssClasses$1.EDITING);
        };
        MDCChipFoundation.prototype.setSelected = function (selected) {
            this.setSelectedImpl(selected);
            this.notifySelection(selected);
        };
        MDCChipFoundation.prototype.setSelectedFromChipSet = function (selected, shouldNotifyClients) {
            this.setSelectedImpl(selected);
            if (shouldNotifyClients) {
                this.notifyIgnoredSelection(selected);
            }
        };
        MDCChipFoundation.prototype.getShouldRemoveOnTrailingIconClick = function () {
            return this.shouldRemoveOnTrailingIconClick;
        };
        MDCChipFoundation.prototype.setShouldRemoveOnTrailingIconClick = function (shouldRemove) {
            this.shouldRemoveOnTrailingIconClick = shouldRemove;
        };
        MDCChipFoundation.prototype.setShouldFocusPrimaryActionOnClick = function (shouldFocus) {
            this.shouldFocusPrimaryActionOnClick = shouldFocus;
        };
        MDCChipFoundation.prototype.getDimensions = function () {
            var _this = this;
            var getRootRect = function () { return _this.adapter.getRootBoundingClientRect(); };
            var getCheckmarkRect = function () {
                return _this.adapter.getCheckmarkBoundingClientRect();
            };
            // When a chip has a checkmark and not a leading icon, the bounding rect changes in size depending on the current
            // size of the checkmark.
            if (!this.adapter.hasLeadingIcon()) {
                var checkmarkRect = getCheckmarkRect();
                if (checkmarkRect) {
                    var rootRect = getRootRect();
                    // Checkmark is a square, meaning the client rect's width and height are identical once the animation completes.
                    // However, the checkbox is initially hidden by setting the width to 0.
                    // To account for an initial width of 0, we use the checkbox's height instead (which equals the end-state width)
                    // when adding it to the root client rect's width.
                    return {
                        bottom: rootRect.bottom,
                        height: rootRect.height,
                        left: rootRect.left,
                        right: rootRect.right,
                        top: rootRect.top,
                        width: rootRect.width + checkmarkRect.height,
                    };
                }
            }
            return getRootRect();
        };
        /**
         * Begins the exit animation which leads to removal of the chip.
         */
        MDCChipFoundation.prototype.beginExit = function () {
            this.adapter.addClass(cssClasses$1.CHIP_EXIT);
        };
        MDCChipFoundation.prototype.handleClick = function () {
            this.adapter.notifyInteraction();
            this.setPrimaryActionFocusable(this.getFocusBehavior());
        };
        MDCChipFoundation.prototype.handleDoubleClick = function () {
            if (this.isEditable()) {
                this.startEditing();
            }
        };
        /**
         * Handles a transition end event on the root element.
         */
        MDCChipFoundation.prototype.handleTransitionEnd = function (evt) {
            var _this = this;
            // Handle transition end event on the chip when it is about to be removed.
            var shouldHandle = this.adapter.eventTargetHasClass(evt.target, cssClasses$1.CHIP_EXIT);
            var widthIsAnimating = evt.propertyName === 'width';
            var opacityIsAnimating = evt.propertyName === 'opacity';
            if (shouldHandle && opacityIsAnimating) {
                // See: https://css-tricks.com/using-css-transitions-auto-dimensions/#article-header-id-5
                var chipWidth_1 = this.adapter.getComputedStyleValue('width');
                // On the next frame (once we get the computed width), explicitly set the chip's width
                // to its current pixel width, so we aren't transitioning out of 'auto'.
                requestAnimationFrame(function () {
                    _this.adapter.setStyleProperty('width', chipWidth_1);
                    // To mitigate jitter, start transitioning padding and margin before width.
                    _this.adapter.setStyleProperty('padding', '0');
                    _this.adapter.setStyleProperty('margin', '0');
                    // On the next frame (once width is explicitly set), transition width to 0.
                    requestAnimationFrame(function () {
                        _this.adapter.setStyleProperty('width', '0');
                    });
                });
                return;
            }
            if (shouldHandle && widthIsAnimating) {
                this.removeFocus();
                var removedAnnouncement = this.adapter.getAttribute(strings$1.REMOVED_ANNOUNCEMENT_ATTRIBUTE);
                this.adapter.notifyRemoval(removedAnnouncement);
            }
            // Handle a transition end event on the leading icon or checkmark, since the transition end event bubbles.
            if (!opacityIsAnimating) {
                return;
            }
            var shouldHideLeadingIcon = this.adapter.eventTargetHasClass(evt.target, cssClasses$1.LEADING_ICON) &&
                this.adapter.hasClass(cssClasses$1.SELECTED);
            var shouldShowLeadingIcon = this.adapter.eventTargetHasClass(evt.target, cssClasses$1.CHECKMARK) &&
                !this.adapter.hasClass(cssClasses$1.SELECTED);
            if (shouldHideLeadingIcon) {
                this.adapter.addClassToLeadingIcon(cssClasses$1.HIDDEN_LEADING_ICON);
                return;
            }
            if (shouldShowLeadingIcon) {
                this.adapter.removeClassFromLeadingIcon(cssClasses$1.HIDDEN_LEADING_ICON);
                return;
            }
        };
        MDCChipFoundation.prototype.handleFocusIn = function (evt) {
            // Early exit if the event doesn't come from the primary action
            if (!this.eventFromPrimaryAction(evt)) {
                return;
            }
            this.adapter.addClass(cssClasses$1.PRIMARY_ACTION_FOCUSED);
        };
        MDCChipFoundation.prototype.handleFocusOut = function (evt) {
            // Early exit if the event doesn't come from the primary action
            if (!this.eventFromPrimaryAction(evt)) {
                return;
            }
            if (this.isEditing()) {
                this.finishEditing();
            }
            this.adapter.removeClass(cssClasses$1.PRIMARY_ACTION_FOCUSED);
        };
        /**
         * Handles an interaction event on the trailing icon element. This is used to
         * prevent the ripple from activating on interaction with the trailing icon.
         */
        MDCChipFoundation.prototype.handleTrailingActionInteraction = function () {
            this.adapter.notifyTrailingIconInteraction();
            this.removeChip();
        };
        /**
         * Handles a keydown event from the root element.
         */
        MDCChipFoundation.prototype.handleKeydown = function (evt) {
            if (this.isEditing()) {
                if (this.shouldFinishEditing(evt)) {
                    evt.preventDefault();
                    this.finishEditing();
                }
                // When editing, the foundation should only handle key events that finish
                // the editing process.
                return;
            }
            if (this.isEditable()) {
                if (this.shouldStartEditing(evt)) {
                    evt.preventDefault();
                    this.startEditing();
                }
            }
            if (this.shouldNotifyInteraction(evt)) {
                this.adapter.notifyInteraction();
                this.setPrimaryActionFocusable(this.getFocusBehavior());
                return;
            }
            if (this.isDeleteAction(evt)) {
                evt.preventDefault();
                this.removeChip();
                return;
            }
            // Early exit if the key is not usable
            if (!navigationKeys.has(evt.key)) {
                return;
            }
            // Prevent default behavior for movement keys which could include scrolling
            evt.preventDefault();
            this.focusNextAction(evt.key, EventSource.PRIMARY);
        };
        MDCChipFoundation.prototype.handleTrailingActionNavigation = function (evt) {
            this.focusNextAction(evt.detail.key, EventSource.TRAILING);
        };
        /**
         * Called by the chip set to remove focus from the chip actions.
         */
        MDCChipFoundation.prototype.removeFocus = function () {
            this.adapter.setPrimaryActionAttr(strings$1.TAB_INDEX, '-1');
            this.adapter.removeTrailingActionFocus();
        };
        /**
         * Called by the chip set to focus the primary action.
         *
         */
        MDCChipFoundation.prototype.focusPrimaryAction = function () {
            this.setPrimaryActionFocusable(FocusBehavior.SHOULD_FOCUS);
        };
        /**
         * Called by the chip set to focus the trailing action (if present), otherwise
         * gives focus to the trailing action.
         */
        MDCChipFoundation.prototype.focusTrailingAction = function () {
            var trailingActionIsNavigable = this.adapter.isTrailingActionNavigable();
            if (trailingActionIsNavigable) {
                this.adapter.setPrimaryActionAttr(strings$1.TAB_INDEX, '-1');
                this.adapter.focusTrailingAction();
                return;
            }
            this.focusPrimaryAction();
        };
        MDCChipFoundation.prototype.setPrimaryActionFocusable = function (focusBehavior) {
            this.adapter.setPrimaryActionAttr(strings$1.TAB_INDEX, '0');
            if (focusBehavior === FocusBehavior.SHOULD_FOCUS) {
                this.adapter.focusPrimaryAction();
            }
            this.adapter.removeTrailingActionFocus();
        };
        MDCChipFoundation.prototype.getFocusBehavior = function () {
            if (this.shouldFocusPrimaryActionOnClick) {
                return FocusBehavior.SHOULD_FOCUS;
            }
            return FocusBehavior.SHOULD_NOT_FOCUS;
        };
        MDCChipFoundation.prototype.focusNextAction = function (key, source) {
            var isTrailingActionNavigable = this.adapter.isTrailingActionNavigable();
            var dir = this.getDirection(key);
            // Early exit if the key should jump chips
            if (jumpChipKeys.has(key) || !isTrailingActionNavigable) {
                this.adapter.notifyNavigation(key, source);
                return;
            }
            if (source === EventSource.PRIMARY && dir === Direction.RIGHT) {
                this.focusTrailingAction();
                return;
            }
            if (source === EventSource.TRAILING && dir === Direction.LEFT) {
                this.focusPrimaryAction();
                return;
            }
            this.adapter.notifyNavigation(key, EventSource.NONE);
        };
        MDCChipFoundation.prototype.getDirection = function (key) {
            var isRTL = this.adapter.isRTL();
            var isLeftKey = key === strings$1.ARROW_LEFT_KEY || key === strings$1.IE_ARROW_LEFT_KEY;
            var isRightKey = key === strings$1.ARROW_RIGHT_KEY || key === strings$1.IE_ARROW_RIGHT_KEY;
            if (!isRTL && isLeftKey || isRTL && isRightKey) {
                return Direction.LEFT;
            }
            return Direction.RIGHT;
        };
        MDCChipFoundation.prototype.removeChip = function () {
            if (this.shouldRemoveOnTrailingIconClick) {
                this.beginExit();
            }
        };
        MDCChipFoundation.prototype.shouldStartEditing = function (evt) {
            return this.eventFromPrimaryAction(evt) && evt.key === strings$1.ENTER_KEY;
        };
        MDCChipFoundation.prototype.shouldFinishEditing = function (evt) {
            return evt.key === strings$1.ENTER_KEY;
        };
        MDCChipFoundation.prototype.shouldNotifyInteraction = function (evt) {
            return evt.key === strings$1.ENTER_KEY || evt.key === strings$1.SPACEBAR_KEY;
        };
        MDCChipFoundation.prototype.isDeleteAction = function (evt) {
            var isDeletable = this.adapter.hasClass(cssClasses$1.DELETABLE);
            return isDeletable &&
                (evt.key === strings$1.BACKSPACE_KEY || evt.key === strings$1.DELETE_KEY ||
                    evt.key === strings$1.IE_DELETE_KEY);
        };
        MDCChipFoundation.prototype.setSelectedImpl = function (selected) {
            if (selected) {
                this.adapter.addClass(cssClasses$1.SELECTED);
                this.adapter.setPrimaryActionAttr(strings$1.ARIA_CHECKED, 'true');
            }
            else {
                this.adapter.removeClass(cssClasses$1.SELECTED);
                this.adapter.setPrimaryActionAttr(strings$1.ARIA_CHECKED, 'false');
            }
        };
        MDCChipFoundation.prototype.notifySelection = function (selected) {
            this.adapter.notifySelection(selected, false);
        };
        MDCChipFoundation.prototype.notifyIgnoredSelection = function (selected) {
            this.adapter.notifySelection(selected, true);
        };
        MDCChipFoundation.prototype.eventFromPrimaryAction = function (evt) {
            return this.adapter.eventTargetHasClass(evt.target, cssClasses$1.PRIMARY_ACTION);
        };
        MDCChipFoundation.prototype.startEditing = function () {
            this.adapter.addClass(cssClasses$1.EDITING);
            this.adapter.notifyEditStart();
        };
        MDCChipFoundation.prototype.finishEditing = function () {
            this.adapter.removeClass(cssClasses$1.EDITING);
            this.adapter.notifyEditFinish();
        };
        return MDCChipFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCChip = /** @class */ (function (_super) {
        __extends(MDCChip, _super);
        function MDCChip() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MDCChip.prototype, "selected", {
            /**
             * @return Whether the chip is selected.
             */
            get: function () {
                return this.foundation.isSelected();
            },
            /**
             * Sets selected state on the chip.
             */
            set: function (selected) {
                this.foundation.setSelected(selected);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChip.prototype, "shouldRemoveOnTrailingIconClick", {
            /**
             * @return Whether a trailing icon click should trigger exit/removal of the chip.
             */
            get: function () {
                return this.foundation.getShouldRemoveOnTrailingIconClick();
            },
            /**
             * Sets whether a trailing icon click should trigger exit/removal of the chip.
             */
            set: function (shouldRemove) {
                this.foundation.setShouldRemoveOnTrailingIconClick(shouldRemove);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChip.prototype, "setShouldFocusPrimaryActionOnClick", {
            /**
             * Sets whether a clicking on the chip should focus the primary action.
             */
            set: function (shouldFocus) {
                this.foundation.setShouldFocusPrimaryActionOnClick(shouldFocus);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChip.prototype, "ripple", {
            get: function () {
                return this.rippleSurface;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChip.prototype, "id", {
            get: function () {
                return this.root.id;
            },
            enumerable: false,
            configurable: true
        });
        MDCChip.attachTo = function (root) {
            return new MDCChip(root);
        };
        MDCChip.prototype.initialize = function (rippleFactory, trailingActionFactory) {
            var _this = this;
            if (rippleFactory === void 0) { rippleFactory = function (el, foundation) { return new MDCRipple(el, foundation); }; }
            if (trailingActionFactory === void 0) { trailingActionFactory = function (el) { return new MDCChipTrailingAction(el); }; }
            this.leadingIcon = this.root.querySelector(strings$1.LEADING_ICON_SELECTOR);
            this.checkmark = this.root.querySelector(strings$1.CHECKMARK_SELECTOR);
            this.primaryAction =
                this.root.querySelector(strings$1.PRIMARY_ACTION_SELECTOR);
            var trailingActionEl = this.root.querySelector(strings$1.TRAILING_ACTION_SELECTOR);
            if (trailingActionEl) {
                this.trailingAction = trailingActionFactory(trailingActionEl);
            }
            // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
            // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
            var rippleAdapter = __assign(__assign({}, MDCRipple.createAdapter(this)), { computeBoundingRect: function () { return _this.foundation.getDimensions(); } });
            this.rippleSurface =
                rippleFactory(this.root, new MDCRippleFoundation(rippleAdapter));
        };
        MDCChip.prototype.initialSyncWithDOM = function () {
            var _this = this;
            // Custom events
            this.handleTrailingActionInteraction = function () {
                _this.foundation.handleTrailingActionInteraction();
            };
            this.handleTrailingActionNavigation =
                function (evt) {
                    _this.foundation.handleTrailingActionNavigation(evt);
                };
            // Native events
            this.handleClick = function () {
                _this.foundation.handleClick();
            };
            this.handleKeydown = function (evt) {
                _this.foundation.handleKeydown(evt);
            };
            this.handleTransitionEnd = function (evt) {
                _this.foundation.handleTransitionEnd(evt);
            };
            this.handleFocusIn = function (evt) {
                _this.foundation.handleFocusIn(evt);
            };
            this.handleFocusOut = function (evt) {
                _this.foundation.handleFocusOut(evt);
            };
            this.listen('transitionend', this.handleTransitionEnd);
            this.listen('click', this.handleClick);
            this.listen('keydown', this.handleKeydown);
            this.listen('focusin', this.handleFocusIn);
            this.listen('focusout', this.handleFocusOut);
            if (this.trailingAction) {
                this.listen(strings$2.INTERACTION_EVENT, this.handleTrailingActionInteraction);
                this.listen(strings$2.NAVIGATION_EVENT, this.handleTrailingActionNavigation);
            }
        };
        MDCChip.prototype.destroy = function () {
            this.rippleSurface.destroy();
            this.unlisten('transitionend', this.handleTransitionEnd);
            this.unlisten('keydown', this.handleKeydown);
            this.unlisten('click', this.handleClick);
            this.unlisten('focusin', this.handleFocusIn);
            this.unlisten('focusout', this.handleFocusOut);
            if (this.trailingAction) {
                this.unlisten(strings$2.INTERACTION_EVENT, this.handleTrailingActionInteraction);
                this.unlisten(strings$2.NAVIGATION_EVENT, this.handleTrailingActionNavigation);
            }
            _super.prototype.destroy.call(this);
        };
        /**
         * Begins the exit animation which leads to removal of the chip.
         */
        MDCChip.prototype.beginExit = function () {
            this.foundation.beginExit();
        };
        MDCChip.prototype.getDefaultFoundation = function () {
            var _this = this;
            // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
            // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
            var adapter = {
                addClass: function (className) { return _this.root.classList.add(className); },
                addClassToLeadingIcon: function (className) {
                    if (_this.leadingIcon) {
                        _this.leadingIcon.classList.add(className);
                    }
                },
                eventTargetHasClass: function (target, className) {
                    return target ? target.classList.contains(className) : false;
                },
                focusPrimaryAction: function () {
                    if (_this.primaryAction) {
                        _this.primaryAction.focus();
                    }
                },
                focusTrailingAction: function () {
                    if (_this.trailingAction) {
                        _this.trailingAction.focus();
                    }
                },
                getAttribute: function (attr) { return _this.root.getAttribute(attr); },
                getCheckmarkBoundingClientRect: function () {
                    return _this.checkmark ? _this.checkmark.getBoundingClientRect() : null;
                },
                getComputedStyleValue: function (propertyName) {
                    return window.getComputedStyle(_this.root).getPropertyValue(propertyName);
                },
                getRootBoundingClientRect: function () { return _this.root.getBoundingClientRect(); },
                hasClass: function (className) { return _this.root.classList.contains(className); },
                hasLeadingIcon: function () { return !!_this.leadingIcon; },
                isRTL: function () { return window.getComputedStyle(_this.root).getPropertyValue('direction') === 'rtl'; },
                isTrailingActionNavigable: function () {
                    if (_this.trailingAction) {
                        return _this.trailingAction.isNavigable();
                    }
                    return false;
                },
                notifyInteraction: function () { return _this.emit(strings$1.INTERACTION_EVENT, { chipId: _this.id }, true /* shouldBubble */); },
                notifyNavigation: function (key, source) {
                    return _this.emit(strings$1.NAVIGATION_EVENT, { chipId: _this.id, key: key, source: source }, true /* shouldBubble */);
                },
                notifyRemoval: function (removedAnnouncement) {
                    _this.emit(strings$1.REMOVAL_EVENT, { chipId: _this.id, removedAnnouncement: removedAnnouncement }, true /* shouldBubble */);
                },
                notifySelection: function (selected, shouldIgnore) {
                    return _this.emit(strings$1.SELECTION_EVENT, { chipId: _this.id, selected: selected, shouldIgnore: shouldIgnore }, true /* shouldBubble */);
                },
                notifyTrailingIconInteraction: function () {
                    return _this.emit(strings$1.TRAILING_ICON_INTERACTION_EVENT, { chipId: _this.id }, true /* shouldBubble */);
                },
                notifyEditStart: function () { },
                notifyEditFinish: function () { },
                removeClass: function (className) { return _this.root.classList.remove(className); },
                removeClassFromLeadingIcon: function (className) {
                    if (_this.leadingIcon) {
                        _this.leadingIcon.classList.remove(className);
                    }
                },
                removeTrailingActionFocus: function () {
                    if (_this.trailingAction) {
                        _this.trailingAction.removeFocus();
                    }
                },
                setPrimaryActionAttr: function (attr, value) {
                    if (_this.primaryAction) {
                        _this.primaryAction.setAttribute(attr, value);
                    }
                },
                setStyleProperty: function (propertyName, value) {
                    return _this.root.style.setProperty(propertyName, value);
                },
            };
            return new MDCChipFoundation(adapter);
        };
        MDCChip.prototype.setSelectedFromChipSet = function (selected, shouldNotifyClients) {
            this.foundation.setSelectedFromChipSet(selected, shouldNotifyClients);
        };
        MDCChip.prototype.focusPrimaryAction = function () {
            this.foundation.focusPrimaryAction();
        };
        MDCChip.prototype.focusTrailingAction = function () {
            this.foundation.focusTrailingAction();
        };
        MDCChip.prototype.removeFocus = function () {
            this.foundation.removeFocus();
        };
        MDCChip.prototype.remove = function () {
            var parent = this.root.parentNode;
            if (parent !== null) {
                parent.removeChild(this.root);
            }
        };
        return MDCChip;
    }(MDCComponent));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var strings = {
        CHIP_SELECTOR: '.mdc-chip',
    };
    var cssClasses = {
        CHOICE: 'mdc-chip-set--choice',
        FILTER: 'mdc-chip-set--filter',
    };

    /**
     * @license
     * Copyright 2017 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var MDCChipSetFoundation = /** @class */ (function (_super) {
        __extends(MDCChipSetFoundation, _super);
        function MDCChipSetFoundation(adapter) {
            var _this = _super.call(this, __assign(__assign({}, MDCChipSetFoundation.defaultAdapter), adapter)) || this;
            /**
             * The ids of the selected chips in the set. Only used for choice chip set or filter chip set.
             */
            _this.selectedChipIds = [];
            return _this;
        }
        Object.defineProperty(MDCChipSetFoundation, "strings", {
            get: function () {
                return strings;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChipSetFoundation, "cssClasses", {
            get: function () {
                return cssClasses;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChipSetFoundation, "defaultAdapter", {
            get: function () {
                return {
                    announceMessage: function () { return undefined; },
                    focusChipPrimaryActionAtIndex: function () { return undefined; },
                    focusChipTrailingActionAtIndex: function () { return undefined; },
                    getChipListCount: function () { return -1; },
                    getIndexOfChipById: function () { return -1; },
                    hasClass: function () { return false; },
                    isRTL: function () { return false; },
                    removeChipAtIndex: function () { return undefined; },
                    removeFocusFromChipAtIndex: function () { return undefined; },
                    selectChipAtIndex: function () { return undefined; },
                };
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns an array of the IDs of all selected chips.
         */
        MDCChipSetFoundation.prototype.getSelectedChipIds = function () {
            return this.selectedChipIds.slice();
        };
        /**
         * Selects the chip with the given id. Deselects all other chips if the chip set is of the choice variant.
         * Does not notify clients of the updated selection state.
         */
        MDCChipSetFoundation.prototype.select = function (chipId) {
            this.selectImpl(chipId, false);
        };
        /**
         * Handles a chip interaction event
         */
        MDCChipSetFoundation.prototype.handleChipInteraction = function (_a) {
            var chipId = _a.chipId;
            var index = this.adapter.getIndexOfChipById(chipId);
            this.removeFocusFromChipsExcept(index);
            if (this.adapter.hasClass(cssClasses.CHOICE) ||
                this.adapter.hasClass(cssClasses.FILTER)) {
                this.toggleSelect(chipId);
            }
        };
        /**
         * Handles a chip selection event, used to handle discrepancy when selection state is set directly on the Chip.
         */
        MDCChipSetFoundation.prototype.handleChipSelection = function (_a) {
            var chipId = _a.chipId, selected = _a.selected, shouldIgnore = _a.shouldIgnore;
            // Early exit if we should ignore the event
            if (shouldIgnore) {
                return;
            }
            var chipIsSelected = this.selectedChipIds.indexOf(chipId) >= 0;
            if (selected && !chipIsSelected) {
                this.select(chipId);
            }
            else if (!selected && chipIsSelected) {
                this.deselectImpl(chipId);
            }
        };
        /**
         * Handles the event when a chip is removed.
         */
        MDCChipSetFoundation.prototype.handleChipRemoval = function (_a) {
            var chipId = _a.chipId, removedAnnouncement = _a.removedAnnouncement;
            if (removedAnnouncement) {
                this.adapter.announceMessage(removedAnnouncement);
            }
            var index = this.adapter.getIndexOfChipById(chipId);
            this.deselectAndNotifyClients(chipId);
            this.adapter.removeChipAtIndex(index);
            var maxIndex = this.adapter.getChipListCount() - 1;
            if (maxIndex < 0) {
                return;
            }
            var nextIndex = Math.min(index, maxIndex);
            this.removeFocusFromChipsExcept(nextIndex);
            // After removing a chip, we should focus the trailing action for the next chip.
            this.adapter.focusChipTrailingActionAtIndex(nextIndex);
        };
        /**
         * Handles a chip navigation event.
         */
        MDCChipSetFoundation.prototype.handleChipNavigation = function (_a) {
            var chipId = _a.chipId, key = _a.key, source = _a.source;
            var maxIndex = this.adapter.getChipListCount() - 1;
            var index = this.adapter.getIndexOfChipById(chipId);
            // Early exit if the index is out of range or the key is unusable
            if (index === -1 || !navigationKeys.has(key)) {
                return;
            }
            var isRTL = this.adapter.isRTL();
            var isLeftKey = key === strings$1.ARROW_LEFT_KEY ||
                key === strings$1.IE_ARROW_LEFT_KEY;
            var isRightKey = key === strings$1.ARROW_RIGHT_KEY ||
                key === strings$1.IE_ARROW_RIGHT_KEY;
            var isDownKey = key === strings$1.ARROW_DOWN_KEY ||
                key === strings$1.IE_ARROW_DOWN_KEY;
            var shouldIncrement = !isRTL && isRightKey || isRTL && isLeftKey || isDownKey;
            var isHome = key === strings$1.HOME_KEY;
            var isEnd = key === strings$1.END_KEY;
            if (shouldIncrement) {
                index++;
            }
            else if (isHome) {
                index = 0;
            }
            else if (isEnd) {
                index = maxIndex;
            }
            else {
                index--;
            }
            // Early exit if the index is out of bounds
            if (index < 0 || index > maxIndex) {
                return;
            }
            this.removeFocusFromChipsExcept(index);
            this.focusChipAction(index, key, source);
        };
        MDCChipSetFoundation.prototype.focusChipAction = function (index, key, source) {
            var shouldJumpChips = jumpChipKeys.has(key);
            if (shouldJumpChips && source === EventSource.PRIMARY) {
                return this.adapter.focusChipPrimaryActionAtIndex(index);
            }
            if (shouldJumpChips && source === EventSource.TRAILING) {
                return this.adapter.focusChipTrailingActionAtIndex(index);
            }
            var dir = this.getDirection(key);
            if (dir === Direction.LEFT) {
                return this.adapter.focusChipTrailingActionAtIndex(index);
            }
            if (dir === Direction.RIGHT) {
                return this.adapter.focusChipPrimaryActionAtIndex(index);
            }
        };
        MDCChipSetFoundation.prototype.getDirection = function (key) {
            var isRTL = this.adapter.isRTL();
            var isLeftKey = key === strings$1.ARROW_LEFT_KEY ||
                key === strings$1.IE_ARROW_LEFT_KEY;
            var isRightKey = key === strings$1.ARROW_RIGHT_KEY ||
                key === strings$1.IE_ARROW_RIGHT_KEY;
            if (!isRTL && isLeftKey || isRTL && isRightKey) {
                return Direction.LEFT;
            }
            return Direction.RIGHT;
        };
        /**
         * Deselects the chip with the given id and optionally notifies clients.
         */
        MDCChipSetFoundation.prototype.deselectImpl = function (chipId, shouldNotifyClients) {
            if (shouldNotifyClients === void 0) { shouldNotifyClients = false; }
            var index = this.selectedChipIds.indexOf(chipId);
            if (index >= 0) {
                this.selectedChipIds.splice(index, 1);
                var chipIndex = this.adapter.getIndexOfChipById(chipId);
                this.adapter.selectChipAtIndex(chipIndex, /** isSelected */ false, shouldNotifyClients);
            }
        };
        /**
         * Deselects the chip with the given id and notifies clients.
         */
        MDCChipSetFoundation.prototype.deselectAndNotifyClients = function (chipId) {
            this.deselectImpl(chipId, true);
        };
        /**
         * Toggles selection of the chip with the given id.
         */
        MDCChipSetFoundation.prototype.toggleSelect = function (chipId) {
            if (this.selectedChipIds.indexOf(chipId) >= 0) {
                this.deselectAndNotifyClients(chipId);
            }
            else {
                this.selectAndNotifyClients(chipId);
            }
        };
        MDCChipSetFoundation.prototype.removeFocusFromChipsExcept = function (index) {
            var chipCount = this.adapter.getChipListCount();
            for (var i = 0; i < chipCount; i++) {
                if (i !== index) {
                    this.adapter.removeFocusFromChipAtIndex(i);
                }
            }
        };
        MDCChipSetFoundation.prototype.selectAndNotifyClients = function (chipId) {
            this.selectImpl(chipId, true);
        };
        MDCChipSetFoundation.prototype.selectImpl = function (chipId, shouldNotifyClients) {
            if (this.selectedChipIds.indexOf(chipId) >= 0) {
                return;
            }
            if (this.adapter.hasClass(cssClasses.CHOICE) &&
                this.selectedChipIds.length > 0) {
                var previouslySelectedChip = this.selectedChipIds[0];
                var previouslySelectedIndex = this.adapter.getIndexOfChipById(previouslySelectedChip);
                this.selectedChipIds = [];
                this.adapter.selectChipAtIndex(previouslySelectedIndex, /** isSelected */ false, shouldNotifyClients);
            }
            this.selectedChipIds.push(chipId);
            var index = this.adapter.getIndexOfChipById(chipId);
            this.adapter.selectChipAtIndex(index, /** isSelected */ true, shouldNotifyClients);
        };
        return MDCChipSetFoundation;
    }(MDCFoundation));

    /**
     * @license
     * Copyright 2016 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    var _a = MDCChipFoundation.strings, INTERACTION_EVENT = _a.INTERACTION_EVENT, SELECTION_EVENT = _a.SELECTION_EVENT, REMOVAL_EVENT = _a.REMOVAL_EVENT, NAVIGATION_EVENT = _a.NAVIGATION_EVENT;
    var CHIP_SELECTOR = MDCChipSetFoundation.strings.CHIP_SELECTOR;
    var idCounter = 0;
    var MDCChipSet = /** @class */ (function (_super) {
        __extends(MDCChipSet, _super);
        function MDCChipSet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDCChipSet.attachTo = function (root) {
            return new MDCChipSet(root);
        };
        Object.defineProperty(MDCChipSet.prototype, "chips", {
            get: function () {
                return this.chipsList.slice();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MDCChipSet.prototype, "selectedChipIds", {
            /**
             * @return An array of the IDs of all selected chips.
             */
            get: function () {
                return this.foundation.getSelectedChipIds();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * @param chipFactory A function which creates a new MDCChip.
         */
        MDCChipSet.prototype.initialize = function (chipFactory) {
            if (chipFactory === void 0) { chipFactory = function (el) { return new MDCChip(el); }; }
            this.chipFactory = chipFactory;
            this.chipsList = this.instantiateChips(this.chipFactory);
        };
        MDCChipSet.prototype.initialSyncWithDOM = function () {
            var e_1, _a;
            var _this = this;
            try {
                for (var _b = __values(this.chipsList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var chip = _c.value;
                    if (chip.id && chip.selected) {
                        this.foundation.select(chip.id);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.handleChipInteraction = function (evt) {
                return _this.foundation.handleChipInteraction(evt.detail);
            };
            this.handleChipSelection = function (evt) {
                return _this.foundation.handleChipSelection(evt.detail);
            };
            this.handleChipRemoval = function (evt) {
                return _this.foundation.handleChipRemoval(evt.detail);
            };
            this.handleChipNavigation = function (evt) {
                return _this.foundation.handleChipNavigation(evt.detail);
            };
            this.listen(INTERACTION_EVENT, this.handleChipInteraction);
            this.listen(SELECTION_EVENT, this.handleChipSelection);
            this.listen(REMOVAL_EVENT, this.handleChipRemoval);
            this.listen(NAVIGATION_EVENT, this.handleChipNavigation);
        };
        MDCChipSet.prototype.destroy = function () {
            var e_2, _a;
            try {
                for (var _b = __values(this.chipsList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var chip = _c.value;
                    chip.destroy();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.unlisten(INTERACTION_EVENT, this.handleChipInteraction);
            this.unlisten(SELECTION_EVENT, this.handleChipSelection);
            this.unlisten(REMOVAL_EVENT, this.handleChipRemoval);
            this.unlisten(NAVIGATION_EVENT, this.handleChipNavigation);
            _super.prototype.destroy.call(this);
        };
        /**
         * Adds a new chip object to the chip set from the given chip element.
         */
        MDCChipSet.prototype.addChip = function (chipEl) {
            chipEl.id = chipEl.id || "mdc-chip-" + ++idCounter;
            this.chipsList.push(this.chipFactory(chipEl));
        };
        MDCChipSet.prototype.getDefaultFoundation = function () {
            var _this = this;
            // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
            // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
            var adapter = {
                announceMessage: function (message) {
                    announce$1(message);
                },
                focusChipPrimaryActionAtIndex: function (index) {
                    _this.chipsList[index].focusPrimaryAction();
                },
                focusChipTrailingActionAtIndex: function (index) {
                    _this.chipsList[index].focusTrailingAction();
                },
                getChipListCount: function () { return _this.chips.length; },
                getIndexOfChipById: function (chipId) {
                    return _this.findChipIndex(chipId);
                },
                hasClass: function (className) { return _this.root.classList.contains(className); },
                isRTL: function () { return window.getComputedStyle(_this.root).getPropertyValue('direction') === 'rtl'; },
                removeChipAtIndex: function (index) {
                    if (index >= 0 && index < _this.chips.length) {
                        _this.chipsList[index].destroy();
                        _this.chipsList[index].remove();
                        _this.chipsList.splice(index, 1);
                    }
                },
                removeFocusFromChipAtIndex: function (index) {
                    _this.chipsList[index].removeFocus();
                },
                selectChipAtIndex: function (index, selected, shouldNotifyClients) {
                    if (index >= 0 && index < _this.chips.length) {
                        _this.chipsList[index].setSelectedFromChipSet(selected, shouldNotifyClients);
                    }
                },
            };
            return new MDCChipSetFoundation(adapter);
        };
        /**
         * Instantiates chip components on all of the chip set's child chip elements.
         */
        MDCChipSet.prototype.instantiateChips = function (chipFactory) {
            var chipElements = [].slice.call(this.root.querySelectorAll(CHIP_SELECTOR));
            return chipElements.map(function (el) {
                el.id = el.id || "mdc-chip-" + ++idCounter;
                return chipFactory(el);
            });
        };
        /**
         * Returns the index of the chip with the given id, or -1 if the chip does not exist.
         */
        MDCChipSet.prototype.findChipIndex = function (chipId) {
            for (var i = 0; i < this.chips.length; i++) {
                if (this.chipsList[i].id === chipId) {
                    return i;
                }
            }
            return -1;
        };
        return MDCChipSet;
    }(MDCComponent));

    /**
     * @license
     * Copyright 2019 Google Inc.
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */

    var deprecated = /*#__PURE__*/Object.freeze({
        __proto__: null,
        trailingActionStrings: strings$2,
        MDCChipTrailingAction: MDCChipTrailingAction,
        MDCChipTrailingActionFoundation: MDCChipTrailingActionFoundation,
        chipCssClasses: cssClasses$1,
        chipStrings: strings$1,
        MDCChip: MDCChip,
        MDCChipFoundation: MDCChipFoundation,
        chipSetCssClasses: cssClasses,
        chipSetStrings: strings,
        MDCChipSet: MDCChipSet,
        MDCChipSetFoundation: MDCChipSetFoundation
    });

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /**
     * A screen reader announcer, compatible with the announce function from
     * @material/dom/announce.js.
     *
     * @param message The text to announce with the screen reader.
     * @param options The options, including "priority" and "ownerDocument".
     */
    function announce(message, options = {}) {
        const priority = options.priority || 'polite';
        const ownerDocument = options.ownerDocument || document;
        const previousElements = ownerDocument.querySelectorAll('[data-smui-dom-announce]');
        if (previousElements.length) {
            previousElements.forEach((el) => {
                var _a;
                (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(el);
            });
        }
        const el = ownerDocument.createElement('div');
        el.style.position = 'absolute';
        el.style.top = '-9999px';
        el.style.left = '-9999px';
        el.style.height = '1px';
        el.style.overflow = 'hidden';
        el.setAttribute('aria-atomic', 'true');
        el.setAttribute('aria-live', priority);
        el.setAttribute('data-mdc-dom-announce', 'true');
        el.setAttribute('data-smui-dom-announce', 'true');
        ownerDocument.body.appendChild(el);
        window.setTimeout(() => {
            el.textContent = message;
            const clear = () => {
                el.textContent = '';
                el.removeEventListener('click', clear);
            };
            el.addEventListener('click', clear, { once: true });
        }, 100);
    }

    function classMap(classObj) {
        return Object.entries(classObj)
            .filter(([name, value]) => name !== '' && value)
            .map(([name]) => name)
            .join(' ');
    }

    function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
    /** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
    duplicateEventForMDC = false) {
        if (typeof Event !== 'undefined' && element) {
            const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
            if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
                const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
                element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
                if (duplicateEvent.defaultPrevented) {
                    event.preventDefault();
                }
            }
            return event;
        }
    }

    function exclude(obj, keys) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const cashIndex = name.indexOf('$');
            if (cashIndex !== -1 &&
                keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
                continue;
            }
            if (keys.indexOf(name) !== -1) {
                continue;
            }
            newObj[name] = obj[name];
        }
        return newObj;
    }

    // Match old modifiers. (only works on DOM events)
    const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    // Match new modifiers.
    const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
    function forwardEventsBuilder(component) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // And we override the $on function to forward all bound events.
        component.$on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let destructor = () => { };
            if ($on) {
                // The event was bound programmatically.
                destructor = $on(eventType, callback);
            }
            else {
                // The event was bound before mount by Svelte.
                events.push([eventType, callback]);
            }
            const oldModifierMatch = eventType.match(oldModifierRegex);
            if (oldModifierMatch && console) {
                console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                    'all events can be bound with modifiers. Please update your ' +
                    'event binding: ', eventType);
            }
            return () => {
                destructor();
            };
        };
        function forward(e) {
            // Internally bubble the event up from Svelte components.
            bubble(component, e);
        }
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (fullEventType, callback) => {
                let eventType = fullEventType;
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                const oldModifierMatch = eventType.match(oldModifierRegex);
                const newModifierMatch = eventType.match(newModifierRegex);
                const modifierMatch = oldModifierMatch || newModifierMatch;
                if (eventType.match(/^SMUI:\w+:/)) {
                    const newEventTypeParts = eventType.split(':');
                    let newEventType = '';
                    for (let i = 0; i < newEventTypeParts.length; i++) {
                        newEventType +=
                            i === newEventTypeParts.length - 1
                                ? ':' + newEventTypeParts[i]
                                : newEventTypeParts[i]
                                    .split('-')
                                    .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                    .join('');
                    }
                    console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                    eventType = newEventType;
                }
                if (modifierMatch) {
                    // Parse the event modifiers.
                    // Supported modifiers:
                    // - preventDefault
                    // - stopPropagation
                    // - passive
                    // - nonpassive
                    // - capture
                    // - once
                    const parts = eventType.split(oldModifierMatch ? ':' : '$');
                    eventType = parts[0];
                    const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                    if (eventOptions.passive) {
                        options = options || {};
                        options.passive = true;
                    }
                    if (eventOptions.nonpassive) {
                        options = options || {};
                        options.passive = false;
                    }
                    if (eventOptions.capture) {
                        options = options || {};
                        options.capture = true;
                    }
                    if (eventOptions.once) {
                        options = options || {};
                        options.once = true;
                    }
                    if (eventOptions.preventDefault) {
                        handler = prevent_default(handler);
                    }
                    if (eventOptions.stopPropagation) {
                        handler = stop_propagation(handler);
                    }
                }
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            for (let i = 0; i < events.length; i++) {
                // Listen to all the events added before mount.
                $on(events[i][0], events[i][1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (let i = 0; i < destructors.length; i++) {
                        destructors[i]();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                },
            };
        };
    }

    function prefixFilter(obj, prefix) {
        let names = Object.getOwnPropertyNames(obj);
        const newObj = {};
        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            if (name.substring(0, prefix.length) === prefix) {
                newObj[name.substring(prefix.length)] = obj[name];
            }
        }
        return newObj;
    }

    function useActions(node, actions) {
        let actionReturns = [];
        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                const actionEntry = actions[i];
                const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
                if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                    actionReturns.push(action(node, actionEntry[1]));
                }
                else {
                    actionReturns.push(action(node));
                }
            }
        }
        return {
            update(actions) {
                if (((actions && actions.length) || 0) != actionReturns.length) {
                    throw new Error('You must not change the length of an actions array.');
                }
                if (actions) {
                    for (let i = 0; i < actions.length; i++) {
                        const returnEntry = actionReturns[i];
                        if (returnEntry && returnEntry.update) {
                            const actionEntry = actions[i];
                            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                                returnEntry.update(actionEntry[1]);
                            }
                            else {
                                returnEntry.update();
                            }
                        }
                    }
                }
            },
            destroy() {
                for (let i = 0; i < actionReturns.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.destroy) {
                        returnEntry.destroy();
                    }
                }
            },
        };
    }

    const { applyPassive } = events;
    const { matches } = ponyfill;
    function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
        let instance;
        let addLayoutListener = getContext('SMUI:addLayoutListener');
        let removeLayoutListener;
        let oldActive = active;
        let oldEventTarget = eventTarget;
        let oldActiveTarget = activeTarget;
        function handleProps() {
            if (surface) {
                addClass('mdc-ripple-surface');
                if (color === 'primary') {
                    addClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                else if (color === 'secondary') {
                    removeClass('smui-ripple-surface--primary');
                    addClass('smui-ripple-surface--secondary');
                }
                else {
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
            }
            else {
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            // Handle activation first.
            if (instance && oldActive !== active) {
                oldActive = active;
                if (active) {
                    instance.activate();
                }
                else if (active === false) {
                    instance.deactivate();
                }
            }
            // Then create/destroy an instance.
            if (ripple && !instance) {
                instance = new MDCRippleFoundation({
                    addClass,
                    browserSupportsCssVars: () => supportsCssVariables(window),
                    computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                    containsEventTarget: (target) => node.contains(target),
                    deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                    deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                    deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                    getWindowPageOffset: () => ({
                        x: window.pageXOffset,
                        y: window.pageYOffset,
                    }),
                    isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                    isSurfaceDisabled: () => !!disabled,
                    isUnbounded: () => !!unbounded,
                    registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                    registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                    registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                    removeClass,
                    updateCssVariable: addStyle,
                });
                initPromise.then(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            else if (instance && !ripple) {
                initPromise.then(() => {
                    if (instance) {
                        instance.destroy();
                        instance = undefined;
                    }
                });
            }
            // Now handle event/active targets
            if (instance &&
                (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
                oldEventTarget = eventTarget;
                oldActiveTarget = activeTarget;
                instance.destroy();
                requestAnimationFrame(() => {
                    if (instance) {
                        instance.init();
                        instance.setUnbounded(unbounded);
                    }
                });
            }
            if (!ripple && unbounded) {
                addClass('mdc-ripple-upgraded--unbounded');
            }
        }
        handleProps();
        if (addLayoutListener) {
            removeLayoutListener = addLayoutListener(layout);
        }
        function layout() {
            if (instance) {
                instance.layout();
            }
        }
        return {
            update(props) {
                ({
                    ripple,
                    surface,
                    unbounded,
                    disabled,
                    color,
                    active,
                    rippleElement,
                    eventTarget,
                    activeTarget,
                    addClass,
                    removeClass,
                    addStyle,
                    initPromise,
                } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
                handleProps();
            },
            destroy() {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                    removeClass('mdc-ripple-surface');
                    removeClass('smui-ripple-surface--primary');
                    removeClass('smui-ripple-surface--secondary');
                }
                if (removeLayoutListener) {
                    removeLayoutListener();
                }
            },
        };
    }

    /* node_modules\@smui\common\dist\elements\Div.svelte generated by Svelte v3.46.4 */
    const file$7 = "node_modules\\@smui\\common\\dist\\elements\\Div.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[3]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[2].call(null, div))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Div', slots, ['default']);
    	let { use = [] } = $$props;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let element;

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		forwardEventsBuilder,
    		useActions,
    		use,
    		forwardEvents,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		element,
    		forwardEvents,
    		$$restProps,
    		getElement,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Div$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$8, safe_not_equal, { use: 0, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Div",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get use() {
    		throw new Error("<Div>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Div = Div$1;

    /* node_modules\@smui\chips\dist\Chip.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1 } = globals;
    const file$6 = "node_modules\\@smui\\chips\\dist\\Chip.svelte";

    // (49:2) {#if ripple && !$nonInteractive}
    function create_if_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-chip__ripple");
    			add_location(div, file$6, 49, 4, 1566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(49:2) {#if ripple && !$nonInteractive}",
    		ctx
    	});

    	return block;
    }

    // (53:2) {#if touch}
    function create_if_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "mdc-chip__touch");
    			add_location(div, file$6, 53, 4, 1636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(53:2) {#if touch}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple: ripple && !$nonInteractive,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-chip': true,     'mdc-chip--selected': selected,     'mdc-chip--touch': touch,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role="row"   on:transitionend={(event) => instance && instance.handleTransitionEnd(event)}   on:click={() => instance && instance.handleClick()}   on:keydown={(event) => instance && instance.handleKeydown(event)}   on:focusin={(event) => instance && instance.handleFocusIn(event)}   on:focusout={(event) => instance && instance.handleFocusOut(event)}   on:SMUIChipTrailingAction:interaction={() =>     instance && instance.handleTrailingActionInteraction()}   on:SMUIChipTrailingAction:navigation={(event) =>     instance && instance.handleTrailingActionNavigation(event)}   on:SMUIChipsChipPrimaryAction:mount={(event) =>     (primaryActionAccessor = event.detail)}   on:SMUIChipsChipPrimaryAction:unmount={() =>     (primaryActionAccessor = undefined)}   on:SMUIChipsChipTrailingAction:mount={(event) =>     (trailingActionAccessor = event.detail)}   on:SMUIChipsChipTrailingAction:unmount={() =>     (trailingActionAccessor = undefined)}   {...$$restProps} >
    function create_default_slot$2(ctx) {
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*ripple*/ ctx[3] && !/*$nonInteractive*/ ctx[13] && create_if_block_1$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[31].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[44], null);
    	let if_block1 = /*touch*/ ctx[4] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*ripple*/ ctx[3] && !/*$nonInteractive*/ ctx[13]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[44],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[44])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[44], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*touch*/ ctx[4]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     [       Ripple,       {         ripple: ripple && !$nonInteractive,         unbounded: false,         addClass,         removeClass,         addStyle,       },     ],     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-chip': true,     'mdc-chip--selected': selected,     'mdc-chip--touch': touch,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   role=\\\"row\\\"   on:transitionend={(event) => instance && instance.handleTransitionEnd(event)}   on:click={() => instance && instance.handleClick()}   on:keydown={(event) => instance && instance.handleKeydown(event)}   on:focusin={(event) => instance && instance.handleFocusIn(event)}   on:focusout={(event) => instance && instance.handleFocusOut(event)}   on:SMUIChipTrailingAction:interaction={() =>     instance && instance.handleTrailingActionInteraction()}   on:SMUIChipTrailingAction:navigation={(event) =>     instance && instance.handleTrailingActionNavigation(event)}   on:SMUIChipsChipPrimaryAction:mount={(event) =>     (primaryActionAccessor = event.detail)}   on:SMUIChipsChipPrimaryAction:unmount={() =>     (primaryActionAccessor = undefined)}   on:SMUIChipsChipTrailingAction:mount={(event) =>     (trailingActionAccessor = event.detail)}   on:SMUIChipsChipTrailingAction:unmount={() =>     (trailingActionAccessor = undefined)}   {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			use: [
    				[
    					Ripple,
    					{
    						ripple: /*ripple*/ ctx[3] && !/*$nonInteractive*/ ctx[13],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[22],
    						removeClass: /*removeClass*/ ctx[23],
    						addStyle: /*addStyle*/ ctx[24]
    					}
    				],
    				/*forwardEvents*/ ctx[14],
    				.../*use*/ ctx[0]
    			]
    		},
    		{
    			class: classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-chip': true,
    				'mdc-chip--selected': /*selected*/ ctx[7],
    				'mdc-chip--touch': /*touch*/ ctx[4],
    				.../*internalClasses*/ ctx[9]
    			})
    		},
    		{
    			style: Object.entries(/*internalStyles*/ ctx[10]).map(func$1).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		{ role: "row" },
    		/*$$restProps*/ ctx[25]
    	];

    	var switch_value = /*component*/ ctx[5];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot$2] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		/*switch_instance_binding*/ ctx[32](switch_instance);
    		switch_instance.$on("transitionend", /*transitionend_handler*/ ctx[33]);
    		switch_instance.$on("click", /*click_handler*/ ctx[34]);
    		switch_instance.$on("keydown", /*keydown_handler*/ ctx[35]);
    		switch_instance.$on("focusin", /*focusin_handler*/ ctx[36]);
    		switch_instance.$on("focusout", /*focusout_handler*/ ctx[37]);
    		switch_instance.$on("SMUIChipTrailingAction:interaction", /*SMUIChipTrailingAction_interaction_handler*/ ctx[38]);
    		switch_instance.$on("SMUIChipTrailingAction:navigation", /*SMUIChipTrailingAction_navigation_handler*/ ctx[39]);
    		switch_instance.$on("SMUIChipsChipPrimaryAction:mount", /*SMUIChipsChipPrimaryAction_mount_handler*/ ctx[40]);
    		switch_instance.$on("SMUIChipsChipPrimaryAction:unmount", /*SMUIChipsChipPrimaryAction_unmount_handler*/ ctx[41]);
    		switch_instance.$on("SMUIChipsChipTrailingAction:mount", /*SMUIChipsChipTrailingAction_mount_handler*/ ctx[42]);
    		switch_instance.$on("SMUIChipsChipTrailingAction:unmount", /*SMUIChipsChipTrailingAction_unmount_handler*/ ctx[43]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*ripple, $nonInteractive, addClass, removeClass, addStyle, forwardEvents, use, className, selected, touch, internalClasses, internalStyles, style, $$restProps*/ 62940831)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*ripple, $nonInteractive, addClass, removeClass, addStyle, forwardEvents, use*/ 29384713 && {
    						use: [
    							[
    								Ripple,
    								{
    									ripple: /*ripple*/ ctx[3] && !/*$nonInteractive*/ ctx[13],
    									unbounded: false,
    									addClass: /*addClass*/ ctx[22],
    									removeClass: /*removeClass*/ ctx[23],
    									addStyle: /*addStyle*/ ctx[24]
    								}
    							],
    							/*forwardEvents*/ ctx[14],
    							.../*use*/ ctx[0]
    						]
    					},
    					dirty[0] & /*className, selected, touch, internalClasses*/ 658 && {
    						class: classMap({
    							[/*className*/ ctx[1]]: true,
    							'mdc-chip': true,
    							'mdc-chip--selected': /*selected*/ ctx[7],
    							'mdc-chip--touch': /*touch*/ ctx[4],
    							.../*internalClasses*/ ctx[9]
    						})
    					},
    					dirty[0] & /*internalStyles, style*/ 1028 && {
    						style: Object.entries(/*internalStyles*/ ctx[10]).map(func$1).concat([/*style*/ ctx[2]]).join(' ')
    					},
    					switch_instance_spread_levels[3],
    					dirty[0] & /*$$restProps*/ 33554432 && get_spread_object(/*$$restProps*/ ctx[25])
    				])
    			: {};

    			if (dirty[0] & /*touch, ripple, $nonInteractive*/ 8216 | dirty[1] & /*$$scope*/ 8192) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[5])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					/*switch_instance_binding*/ ctx[32](switch_instance);
    					switch_instance.$on("transitionend", /*transitionend_handler*/ ctx[33]);
    					switch_instance.$on("click", /*click_handler*/ ctx[34]);
    					switch_instance.$on("keydown", /*keydown_handler*/ ctx[35]);
    					switch_instance.$on("focusin", /*focusin_handler*/ ctx[36]);
    					switch_instance.$on("focusout", /*focusout_handler*/ ctx[37]);
    					switch_instance.$on("SMUIChipTrailingAction:interaction", /*SMUIChipTrailingAction_interaction_handler*/ ctx[38]);
    					switch_instance.$on("SMUIChipTrailingAction:navigation", /*SMUIChipTrailingAction_navigation_handler*/ ctx[39]);
    					switch_instance.$on("SMUIChipsChipPrimaryAction:mount", /*SMUIChipsChipPrimaryAction_mount_handler*/ ctx[40]);
    					switch_instance.$on("SMUIChipsChipPrimaryAction:unmount", /*SMUIChipsChipPrimaryAction_unmount_handler*/ ctx[41]);
    					switch_instance.$on("SMUIChipsChipTrailingAction:mount", /*SMUIChipsChipTrailingAction_mount_handler*/ ctx[42]);
    					switch_instance.$on("SMUIChipsChipTrailingAction:unmount", /*SMUIChipsChipTrailingAction_unmount_handler*/ ctx[43]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*switch_instance_binding*/ ctx[32](null);
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = ([name, value]) => `${name}: ${value};`;

    function instance_1$2($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","chip","ripple","touch","shouldRemoveOnTrailingIconClick","shouldFocusPrimaryActionOnClick","component","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $index;
    	let $choice;
    	let $leadingIconClassesStore;
    	let $isSelectedStore;
    	let $shouldRemoveOnTrailingIconClickStore;
    	let $initialSelectedStore;
    	let $nonInteractive;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chip', slots, ['default']);
    	const { MDCChipFoundation } = deprecated;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { chip: chipId } = $$props;
    	let { ripple = true } = $$props;
    	let { touch = false } = $$props;
    	let { shouldRemoveOnTrailingIconClick = true } = $$props;
    	let { shouldFocusPrimaryActionOnClick = true } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let leadingIconClasses = {};
    	let internalStyles = {};
    	const initialSelectedStore = getContext('SMUI:chips:chip:initialSelected');
    	validate_store(initialSelectedStore, 'initialSelectedStore');
    	component_subscribe($$self, initialSelectedStore, value => $$invalidate(50, $initialSelectedStore = value));
    	let selected = $initialSelectedStore;
    	let primaryActionAccessor = undefined;
    	let trailingActionAccessor = undefined;
    	const nonInteractive = getContext('SMUI:chips:nonInteractive');
    	validate_store(nonInteractive, 'nonInteractive');
    	component_subscribe($$self, nonInteractive, value => $$invalidate(13, $nonInteractive = value));
    	const choice = getContext('SMUI:chips:choice');
    	validate_store(choice, 'choice');
    	component_subscribe($$self, choice, value => $$invalidate(46, $choice = value));
    	const index = getContext('SMUI:chips:chip:index');
    	validate_store(index, 'index');
    	component_subscribe($$self, index, value => $$invalidate(45, $index = value));
    	let { component = Div } = $$props;
    	const shouldRemoveOnTrailingIconClickStore = writable(shouldRemoveOnTrailingIconClick);
    	validate_store(shouldRemoveOnTrailingIconClickStore, 'shouldRemoveOnTrailingIconClickStore');
    	component_subscribe($$self, shouldRemoveOnTrailingIconClickStore, value => $$invalidate(49, $shouldRemoveOnTrailingIconClickStore = value));
    	setContext('SMUI:chips:chip:shouldRemoveOnTrailingIconClick', shouldRemoveOnTrailingIconClickStore);
    	const isSelectedStore = writable(selected);
    	validate_store(isSelectedStore, 'isSelectedStore');
    	component_subscribe($$self, isSelectedStore, value => $$invalidate(48, $isSelectedStore = value));
    	setContext('SMUI:chips:chip:isSelected', isSelectedStore);
    	const leadingIconClassesStore = writable(leadingIconClasses);
    	validate_store(leadingIconClassesStore, 'leadingIconClassesStore');
    	component_subscribe($$self, leadingIconClassesStore, value => $$invalidate(47, $leadingIconClassesStore = value));
    	setContext('SMUI:chips:chip:leadingIconClasses', leadingIconClassesStore);
    	setContext('SMUI:chips:chip:focusable', $choice && selected || $index === 0);

    	if (!chipId) {
    		throw new Error('The chip property is required! It should be passed down from the Set to the Chip.');
    	}

    	onMount(() => {
    		$$invalidate(6, instance = new MDCChipFoundation({
    				addClass,
    				addClassToLeadingIcon: addLeadingIconClass,
    				eventTargetHasClass: (target, className) => target && 'classList' in target
    				? target.classList.contains(className)
    				: false,
    				focusPrimaryAction: () => {
    					if (primaryActionAccessor) {
    						primaryActionAccessor.focus();
    					}
    				},
    				focusTrailingAction: () => {
    					if (trailingActionAccessor) {
    						trailingActionAccessor.focus();
    					}
    				},
    				getAttribute: attr => getElement().getAttribute(attr),
    				getCheckmarkBoundingClientRect: () => {
    					const target = getElement().querySelector('.mdc-chip__checkmark');

    					if (target) {
    						return target.getBoundingClientRect();
    					}

    					return null;
    				},
    				getComputedStyleValue: getStyle,
    				getRootBoundingClientRect: () => getElement().getBoundingClientRect(),
    				hasClass,
    				hasLeadingIcon: () => {
    					const target = getElement().querySelector('.mdc-chip__icon--leading');
    					return !!target;
    				},
    				isRTL: () => getComputedStyle(getElement()).getPropertyValue('direction') === 'rtl',
    				isTrailingActionNavigable: () => {
    					if (trailingActionAccessor) {
    						return trailingActionAccessor.isNavigable();
    					}

    					return false;
    				},
    				notifyInteraction: () => dispatch(getElement(), 'SMUIChip:interaction', { chipId }, undefined, true),
    				notifyNavigation: (key, source) => dispatch(getElement(), 'SMUIChip:navigation', { chipId, key, source }, undefined, true),
    				notifyRemoval: removedAnnouncement => {
    					dispatch(getElement(), 'SMUIChip:removal', { chipId, removedAnnouncement }, undefined, true);
    				},
    				notifySelection: (selected, shouldIgnore) => dispatch(getElement(), 'SMUIChip:selection', { chipId, selected, shouldIgnore }, undefined, true),
    				notifyTrailingIconInteraction: () => dispatch(getElement(), 'SMUIChip:trailingIconInteraction', { chipId }, undefined, true),
    				notifyEditStart: () => {
    					
    				}, /* Not Implemented. */
    				notifyEditFinish: () => {
    					
    				}, /* Not Implemented. */
    				removeClass,
    				removeClassFromLeadingIcon: removeLeadingIconClass,
    				removeTrailingActionFocus: () => {
    					if (trailingActionAccessor) {
    						trailingActionAccessor.removeFocus();
    					}
    				},
    				setPrimaryActionAttr: (attr, value) => {
    					if (primaryActionAccessor) {
    						primaryActionAccessor.addAttr(attr, value);
    					}
    				},
    				setStyleProperty: addStyle
    			}));

    		const accessor = {
    			chipId,
    			get selected() {
    				return selected;
    			},
    			focusPrimaryAction,
    			focusTrailingAction,
    			removeFocus,
    			setSelectedFromChipSet
    		};

    		dispatch(getElement(), 'SMUIChipsChip:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(getElement(), 'SMUIChipsChip:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function hasClass(className) {
    		return className in internalClasses
    		? internalClasses[className]
    		: getElement().classList.contains(className);
    	}

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(9, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addLeadingIconClass(className) {
    		if (!leadingIconClasses[className]) {
    			$$invalidate(30, leadingIconClasses[className] = true, leadingIconClasses);
    		}
    	}

    	function removeLeadingIconClass(className) {
    		if (!(className in leadingIconClasses) || leadingIconClasses[className]) {
    			$$invalidate(30, leadingIconClasses[className] = false, leadingIconClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(10, internalStyles);
    			} else {
    				$$invalidate(10, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getStyle(name) {
    		return name in internalStyles
    		? internalStyles[name]
    		: getComputedStyle(getElement()).getPropertyValue(name);
    	}

    	function setSelectedFromChipSet(value, shouldNotifyClients) {
    		$$invalidate(7, selected = value);
    		instance.setSelectedFromChipSet(selected, shouldNotifyClients);
    	}

    	function focusPrimaryAction() {
    		instance.focusPrimaryAction();
    	}

    	function focusTrailingAction() {
    		instance.focusTrailingAction();
    	}

    	function removeFocus() {
    		instance.removeFocus();
    	}

    	function getElement() {
    		return element.getElement();
    	}

    	function switch_instance_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(8, element);
    		});
    	}

    	const transitionend_handler = event => instance && instance.handleTransitionEnd(event);
    	const click_handler = () => instance && instance.handleClick();
    	const keydown_handler = event => instance && instance.handleKeydown(event);
    	const focusin_handler = event => instance && instance.handleFocusIn(event);
    	const focusout_handler = event => instance && instance.handleFocusOut(event);
    	const SMUIChipTrailingAction_interaction_handler = () => instance && instance.handleTrailingActionInteraction();
    	const SMUIChipTrailingAction_navigation_handler = event => instance && instance.handleTrailingActionNavigation(event);
    	const SMUIChipsChipPrimaryAction_mount_handler = event => $$invalidate(11, primaryActionAccessor = event.detail);
    	const SMUIChipsChipPrimaryAction_unmount_handler = () => $$invalidate(11, primaryActionAccessor = undefined);
    	const SMUIChipsChipTrailingAction_mount_handler = event => $$invalidate(12, trailingActionAccessor = event.detail);
    	const SMUIChipsChipTrailingAction_unmount_handler = () => $$invalidate(12, trailingActionAccessor = undefined);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(25, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('chip' in $$new_props) $$invalidate(26, chipId = $$new_props.chip);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('touch' in $$new_props) $$invalidate(4, touch = $$new_props.touch);
    		if ('shouldRemoveOnTrailingIconClick' in $$new_props) $$invalidate(27, shouldRemoveOnTrailingIconClick = $$new_props.shouldRemoveOnTrailingIconClick);
    		if ('shouldFocusPrimaryActionOnClick' in $$new_props) $$invalidate(28, shouldFocusPrimaryActionOnClick = $$new_props.shouldFocusPrimaryActionOnClick);
    		if ('component' in $$new_props) $$invalidate(5, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(44, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		deprecated,
    		onMount,
    		setContext,
    		getContext,
    		writable,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		dispatch,
    		Ripple,
    		Div,
    		MDCChipFoundation,
    		forwardEvents,
    		use,
    		className,
    		style,
    		chipId,
    		ripple,
    		touch,
    		shouldRemoveOnTrailingIconClick,
    		shouldFocusPrimaryActionOnClick,
    		element,
    		instance,
    		internalClasses,
    		leadingIconClasses,
    		internalStyles,
    		initialSelectedStore,
    		selected,
    		primaryActionAccessor,
    		trailingActionAccessor,
    		nonInteractive,
    		choice,
    		index,
    		component,
    		shouldRemoveOnTrailingIconClickStore,
    		isSelectedStore,
    		leadingIconClassesStore,
    		hasClass,
    		addClass,
    		removeClass,
    		addLeadingIconClass,
    		removeLeadingIconClass,
    		addStyle,
    		getStyle,
    		setSelectedFromChipSet,
    		focusPrimaryAction,
    		focusTrailingAction,
    		removeFocus,
    		getElement,
    		$index,
    		$choice,
    		$leadingIconClassesStore,
    		$isSelectedStore,
    		$shouldRemoveOnTrailingIconClickStore,
    		$initialSelectedStore,
    		$nonInteractive
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('chipId' in $$props) $$invalidate(26, chipId = $$new_props.chipId);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('touch' in $$props) $$invalidate(4, touch = $$new_props.touch);
    		if ('shouldRemoveOnTrailingIconClick' in $$props) $$invalidate(27, shouldRemoveOnTrailingIconClick = $$new_props.shouldRemoveOnTrailingIconClick);
    		if ('shouldFocusPrimaryActionOnClick' in $$props) $$invalidate(28, shouldFocusPrimaryActionOnClick = $$new_props.shouldFocusPrimaryActionOnClick);
    		if ('element' in $$props) $$invalidate(8, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(6, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(9, internalClasses = $$new_props.internalClasses);
    		if ('leadingIconClasses' in $$props) $$invalidate(30, leadingIconClasses = $$new_props.leadingIconClasses);
    		if ('internalStyles' in $$props) $$invalidate(10, internalStyles = $$new_props.internalStyles);
    		if ('selected' in $$props) $$invalidate(7, selected = $$new_props.selected);
    		if ('primaryActionAccessor' in $$props) $$invalidate(11, primaryActionAccessor = $$new_props.primaryActionAccessor);
    		if ('trailingActionAccessor' in $$props) $$invalidate(12, trailingActionAccessor = $$new_props.trailingActionAccessor);
    		if ('component' in $$props) $$invalidate(5, component = $$new_props.component);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*shouldRemoveOnTrailingIconClick*/ 134217728) {
    			set_store_value(shouldRemoveOnTrailingIconClickStore, $shouldRemoveOnTrailingIconClickStore = shouldRemoveOnTrailingIconClick, $shouldRemoveOnTrailingIconClickStore);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 128) {
    			set_store_value(isSelectedStore, $isSelectedStore = selected, $isSelectedStore);
    		}

    		if ($$self.$$.dirty[0] & /*leadingIconClasses*/ 1073741824) {
    			set_store_value(leadingIconClassesStore, $leadingIconClassesStore = leadingIconClasses, $leadingIconClassesStore);
    		}

    		if ($$self.$$.dirty[0] & /*instance, shouldRemoveOnTrailingIconClick*/ 134217792) {
    			if (instance && instance.getShouldRemoveOnTrailingIconClick() !== shouldRemoveOnTrailingIconClick) {
    				instance.setShouldRemoveOnTrailingIconClick(shouldRemoveOnTrailingIconClick);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, shouldFocusPrimaryActionOnClick*/ 268435520) {
    			if (instance) {
    				instance.setShouldFocusPrimaryActionOnClick(shouldFocusPrimaryActionOnClick);
    			}
    		}
    	};

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		touch,
    		component,
    		instance,
    		selected,
    		element,
    		internalClasses,
    		internalStyles,
    		primaryActionAccessor,
    		trailingActionAccessor,
    		$nonInteractive,
    		forwardEvents,
    		initialSelectedStore,
    		nonInteractive,
    		choice,
    		index,
    		shouldRemoveOnTrailingIconClickStore,
    		isSelectedStore,
    		leadingIconClassesStore,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		chipId,
    		shouldRemoveOnTrailingIconClick,
    		shouldFocusPrimaryActionOnClick,
    		getElement,
    		leadingIconClasses,
    		slots,
    		switch_instance_binding,
    		transitionend_handler,
    		click_handler,
    		keydown_handler,
    		focusin_handler,
    		focusout_handler,
    		SMUIChipTrailingAction_interaction_handler,
    		SMUIChipTrailingAction_navigation_handler,
    		SMUIChipsChipPrimaryAction_mount_handler,
    		SMUIChipsChipPrimaryAction_unmount_handler,
    		SMUIChipsChipTrailingAction_mount_handler,
    		SMUIChipsChipTrailingAction_unmount_handler,
    		$$scope
    	];
    }

    class Chip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$2,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				use: 0,
    				class: 1,
    				style: 2,
    				chip: 26,
    				ripple: 3,
    				touch: 4,
    				shouldRemoveOnTrailingIconClick: 27,
    				shouldFocusPrimaryActionOnClick: 28,
    				component: 5,
    				getElement: 29
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chip",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*chipId*/ ctx[26] === undefined && !('chip' in props)) {
    			console.warn("<Chip> was created without expected prop 'chip'");
    		}
    	}

    	get use() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chip() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chip(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldRemoveOnTrailingIconClick() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldRemoveOnTrailingIconClick(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldFocusPrimaryActionOnClick() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldFocusPrimaryActionOnClick(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error_1("<Chip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[29];
    	}

    	set getElement(value) {
    		throw new Error_1("<Chip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\common\dist\ContextFragment.svelte generated by Svelte v3.46.4 */

    function create_fragment$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
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

    function instance$4($$self, $$props, $$invalidate) {
    	let $storeValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContextFragment', slots, ['default']);
    	let { key } = $$props;
    	let { value } = $$props;
    	const storeValue = writable(value);
    	validate_store(storeValue, 'storeValue');
    	component_subscribe($$self, storeValue, value => $$invalidate(5, $storeValue = value));
    	setContext(key, storeValue);

    	onDestroy(() => {
    		storeValue.set(undefined);
    	});

    	const writable_props = ['key', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContextFragment> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		setContext,
    		writable,
    		key,
    		value,
    		storeValue,
    		$storeValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(1, key = $$props.key);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			set_store_value(storeValue, $storeValue = value, $storeValue);
    		}
    	};

    	return [storeValue, key, value, $$scope, slots];
    }

    class ContextFragment extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, { key: 1, value: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContextFragment",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*key*/ ctx[1] === undefined && !('key' in props)) {
    			console.warn("<ContextFragment> was created without expected prop 'key'");
    		}

    		if (/*value*/ ctx[2] === undefined && !('value' in props)) {
    			console.warn("<ContextFragment> was created without expected prop 'value'");
    		}
    	}

    	get key() {
    		throw new Error("<ContextFragment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<ContextFragment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ContextFragment>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ContextFragment>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\chips\dist\Set.svelte generated by Svelte v3.46.4 */
    const file$5 = "node_modules\\@smui\\chips\\dist\\Set.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	child_ctx[39] = i;
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({ chip: dirty[0] & /*chips*/ 1 });
    const get_default_slot_context = ctx => ({ chip: /*chip*/ ctx[37] });

    // (24:6) <ContextFragment         key="SMUI:chips:chip:initialSelected"         value={initialSelected[i]}       >
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[25].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[27], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, chips*/ 134217729)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[27],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[27])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[27], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(24:6) <ContextFragment         key=\\\"SMUI:chips:chip:initialSelected\\\"         value={initialSelected[i]}       >",
    		ctx
    	});

    	return block;
    }

    // (23:4) <ContextFragment key="SMUI:chips:chip:index" value={i}>
    function create_default_slot$1(ctx) {
    	let contextfragment;
    	let t;
    	let current;

    	contextfragment = new ContextFragment({
    			props: {
    				key: "SMUI:chips:chip:initialSelected",
    				value: /*initialSelected*/ ctx[10][/*i*/ ctx[39]],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contextfragment.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(contextfragment, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contextfragment_changes = {};
    			if (dirty[0] & /*chips*/ 1) contextfragment_changes.value = /*initialSelected*/ ctx[10][/*i*/ ctx[39]];

    			if (dirty[0] & /*$$scope, chips*/ 134217729) {
    				contextfragment_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment.$set(contextfragment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contextfragment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contextfragment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contextfragment, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(23:4) <ContextFragment key=\\\"SMUI:chips:chip:index\\\" value={i}>",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#each chips as chip, i (key(chip))}
    function create_each_block$1(key_2, ctx) {
    	let first;
    	let contextfragment;
    	let current;

    	contextfragment = new ContextFragment({
    			props: {
    				key: "SMUI:chips:chip:index",
    				value: /*i*/ ctx[39],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(contextfragment.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(contextfragment, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const contextfragment_changes = {};
    			if (dirty[0] & /*chips*/ 1) contextfragment_changes.value = /*i*/ ctx[39];

    			if (dirty[0] & /*$$scope, chips*/ 134217729) {
    				contextfragment_changes.$$scope = { dirty, ctx };
    			}

    			contextfragment.$set(contextfragment_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contextfragment.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contextfragment.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(contextfragment, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(22:2) {#each chips as chip, i (key(chip))}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div_class_value;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*chips*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*key*/ ctx[3](/*chip*/ ctx[37]);
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	let div_levels = [
    		{
    			class: div_class_value = classMap({
    				[/*className*/ ctx[2]]: true,
    				'mdc-chip-set': true,
    				'smui-chip-set--non-interactive': /*nonInteractive*/ ctx[4],
    				'mdc-chip-set--choice': /*choice*/ ctx[5],
    				'mdc-chip-set--filter': /*filter*/ ctx[6],
    				'mdc-chip-set--input': /*input*/ ctx[7]
    			})
    		},
    		{ role: "grid" },
    		/*$$restProps*/ ctx[20]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(div, div_data);
    			add_location(div, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[26](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[1])),
    					action_destroyer(/*forwardEvents*/ ctx[9].call(null, div)),
    					listen_dev(div, "SMUIChipsChip:mount", /*handleChipMount*/ ctx[14], false, false, false),
    					listen_dev(div, "SMUIChipsChip:unmount", /*handleChipUnmount*/ ctx[15], false, false, false),
    					listen_dev(div, "SMUIChip:interaction", /*handleChipInteraction*/ ctx[16], false, false, false),
    					listen_dev(div, "SMUIChip:selection", /*handleChipSelection*/ ctx[17], false, false, false),
    					listen_dev(div, "SMUIChip:removal", /*handleChipRemoval*/ ctx[18], false, false, false),
    					listen_dev(div, "SMUIChip:navigation", /*handleChipNavigation*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*chips, initialSelected, $$scope, key*/ 134218761) {
    				each_value = /*chips*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className, nonInteractive, choice, filter, input*/ 244 && div_class_value !== (div_class_value = classMap({
    					[/*className*/ ctx[2]]: true,
    					'mdc-chip-set': true,
    					'smui-chip-set--non-interactive': /*nonInteractive*/ ctx[4],
    					'mdc-chip-set--choice': /*choice*/ ctx[5],
    					'mdc-chip-set--filter': /*filter*/ ctx[6],
    					'mdc-chip-set--input': /*input*/ ctx[7]
    				}))) && { class: div_class_value },
    				{ role: "grid" },
    				dirty[0] & /*$$restProps*/ 1048576 && /*$$restProps*/ ctx[20]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*div_binding*/ ctx[26](null);
    			mounted = false;
    			run_all(dispose);
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

    function setDifference(setA, setB) {
    	let _difference = new Set(setA);

    	for (let elem of setB) {
    		_difference.delete(elem);
    	}

    	return _difference;
    }

    function instance_1$1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","chips","key","selected","nonInteractive","choice","filter","input","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $filterStore;
    	let $choiceStore;
    	let $nonInteractiveStore;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Set', slots, ['default']);
    	const { MDCChipSetFoundation } = deprecated;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { chips = [] } = $$props;
    	let { key = chip => chip } = $$props;
    	let { selected = undefined } = $$props;
    	let { nonInteractive = false } = $$props;
    	let { choice = false } = $$props;
    	let { filter = false } = $$props;
    	let { input = false } = $$props;
    	let element;
    	let instance;
    	let chipAccessorMap = {};
    	let chipAccessorWeakMap = new WeakMap();
    	let initialSelected = chips.map(chipId => choice && selected === chipId || filter && selected.indexOf(chipId) !== -1);
    	const nonInteractiveStore = writable(nonInteractive);
    	validate_store(nonInteractiveStore, 'nonInteractiveStore');
    	component_subscribe($$self, nonInteractiveStore, value => $$invalidate(31, $nonInteractiveStore = value));
    	setContext('SMUI:chips:nonInteractive', nonInteractiveStore);
    	const choiceStore = writable(choice);
    	validate_store(choiceStore, 'choiceStore');
    	component_subscribe($$self, choiceStore, value => $$invalidate(30, $choiceStore = value));
    	setContext('SMUI:chips:choice', choiceStore);
    	const filterStore = writable(filter);
    	validate_store(filterStore, 'filterStore');
    	component_subscribe($$self, filterStore, value => $$invalidate(29, $filterStore = value));
    	setContext('SMUI:chips:filter', filterStore);
    	let previousSelected = filter ? new Set(selected) : selected;

    	onMount(() => {
    		$$invalidate(23, instance = new MDCChipSetFoundation({
    				announceMessage: announce,
    				focusChipPrimaryActionAtIndex: index => {
    					var _a;

    					(_a = getAccessor(chips[index])) === null || _a === void 0
    					? void 0
    					: _a.focusPrimaryAction();
    				},
    				focusChipTrailingActionAtIndex: index => {
    					var _a;

    					(_a = getAccessor(chips[index])) === null || _a === void 0
    					? void 0
    					: _a.focusTrailingAction();
    				},
    				getChipListCount: () => chips.length,
    				getIndexOfChipById: chipId => chips.indexOf(chipId),
    				hasClass: className => getElement().classList.contains(className),
    				isRTL: () => getComputedStyle(getElement()).getPropertyValue('direction') === 'rtl',
    				removeChipAtIndex: index => {
    					if (index >= 0 && index < chips.length) {
    						if (choice && selected === chips[index]) {
    							$$invalidate(21, selected = null);
    						} else if (filter && selected.indexOf(chips[index]) !== -1) {
    							selected.splice(selected.indexOf(chips[index]), 1);
    							$$invalidate(21, selected);
    						}

    						chips.splice(index, 1);
    						$$invalidate(0, chips);
    					}
    				},
    				removeFocusFromChipAtIndex: index => {
    					var _a;

    					(_a = getAccessor(chips[index])) === null || _a === void 0
    					? void 0
    					: _a.removeFocus();
    				},
    				selectChipAtIndex: (index, selectedValue, shouldNotifyClients) => {
    					var _a;

    					if (index >= 0 && index < chips.length) {
    						if (filter) {
    							const selIndex = selected.indexOf(chips[index]);

    							if (selectedValue && selIndex === -1) {
    								selected.push(chips[index]);
    								$$invalidate(21, selected);
    							} else if (!selectedValue && selIndex !== -1) {
    								selected.splice(selIndex, 1);
    								$$invalidate(21, selected);
    							}
    						} else if (choice && (selectedValue || selected === chips[index])) {
    							$$invalidate(21, selected = selectedValue ? chips[index] : null);
    						}

    						(_a = getAccessor(chips[index])) === null || _a === void 0
    						? void 0
    						: _a.setSelectedFromChipSet(selectedValue, shouldNotifyClients);
    					}
    				}
    			}));

    		instance.init();

    		if (choice && selected != null) {
    			instance.select(selected);
    		} else if (filter && selected.length) {
    			for (const chipId of selected) {
    				instance.select(chipId);
    			}
    		}

    		return () => {
    			instance.destroy();
    		};
    	});

    	function handleChipMount(event) {
    		const accessor = event.detail;
    		addAccessor(accessor.chipId, accessor);
    	}

    	function handleChipUnmount(event) {
    		const accessor = event.detail;
    		removeAccessor(accessor.chipId);
    	}

    	function handleChipInteraction(event) {
    		if (instance) {
    			instance.handleChipInteraction(event.detail);
    		}
    	}

    	function handleChipSelection(event) {
    		if (instance) {
    			instance.handleChipSelection(event.detail);
    		}
    	}

    	function handleChipRemoval(event) {
    		if (instance) {
    			instance.handleChipRemoval(event.detail);
    		}
    	}

    	function handleChipNavigation(event) {
    		if (instance) {
    			instance.handleChipNavigation(event.detail);
    		}
    	}

    	function getAccessor(chipId) {
    		return chipId instanceof Object
    		? chipAccessorWeakMap.get(chipId)
    		: chipAccessorMap[chipId];
    	}

    	function addAccessor(chipId, accessor) {
    		if (chipId instanceof Object) {
    			chipAccessorWeakMap.set(chipId, accessor);
    		} else {
    			chipAccessorMap[chipId] = accessor;
    		}
    	}

    	function removeAccessor(chipId) {
    		if (chipId instanceof Object) {
    			chipAccessorWeakMap.delete(chipId);
    		} else {
    			delete chipAccessorMap[chipId];
    		}
    	}

    	function getElement() {
    		return element;
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(8, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(20, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('chips' in $$new_props) $$invalidate(0, chips = $$new_props.chips);
    		if ('key' in $$new_props) $$invalidate(3, key = $$new_props.key);
    		if ('selected' in $$new_props) $$invalidate(21, selected = $$new_props.selected);
    		if ('nonInteractive' in $$new_props) $$invalidate(4, nonInteractive = $$new_props.nonInteractive);
    		if ('choice' in $$new_props) $$invalidate(5, choice = $$new_props.choice);
    		if ('filter' in $$new_props) $$invalidate(6, filter = $$new_props.filter);
    		if ('input' in $$new_props) $$invalidate(7, input = $$new_props.input);
    		if ('$$scope' in $$new_props) $$invalidate(27, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		deprecated,
    		onMount,
    		setContext,
    		writable,
    		get_current_component,
    		announce,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		ContextFragment,
    		MDCChipSetFoundation,
    		forwardEvents,
    		use,
    		className,
    		chips,
    		key,
    		selected,
    		nonInteractive,
    		choice,
    		filter,
    		input,
    		element,
    		instance,
    		chipAccessorMap,
    		chipAccessorWeakMap,
    		initialSelected,
    		nonInteractiveStore,
    		choiceStore,
    		filterStore,
    		previousSelected,
    		setDifference,
    		handleChipMount,
    		handleChipUnmount,
    		handleChipInteraction,
    		handleChipSelection,
    		handleChipRemoval,
    		handleChipNavigation,
    		getAccessor,
    		addAccessor,
    		removeAccessor,
    		getElement,
    		$filterStore,
    		$choiceStore,
    		$nonInteractiveStore
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('chips' in $$props) $$invalidate(0, chips = $$new_props.chips);
    		if ('key' in $$props) $$invalidate(3, key = $$new_props.key);
    		if ('selected' in $$props) $$invalidate(21, selected = $$new_props.selected);
    		if ('nonInteractive' in $$props) $$invalidate(4, nonInteractive = $$new_props.nonInteractive);
    		if ('choice' in $$props) $$invalidate(5, choice = $$new_props.choice);
    		if ('filter' in $$props) $$invalidate(6, filter = $$new_props.filter);
    		if ('input' in $$props) $$invalidate(7, input = $$new_props.input);
    		if ('element' in $$props) $$invalidate(8, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(23, instance = $$new_props.instance);
    		if ('chipAccessorMap' in $$props) chipAccessorMap = $$new_props.chipAccessorMap;
    		if ('chipAccessorWeakMap' in $$props) chipAccessorWeakMap = $$new_props.chipAccessorWeakMap;
    		if ('initialSelected' in $$props) $$invalidate(10, initialSelected = $$new_props.initialSelected);
    		if ('previousSelected' in $$props) $$invalidate(24, previousSelected = $$new_props.previousSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*nonInteractive*/ 16) {
    			set_store_value(nonInteractiveStore, $nonInteractiveStore = nonInteractive, $nonInteractiveStore);
    		}

    		if ($$self.$$.dirty[0] & /*choice*/ 32) {
    			set_store_value(choiceStore, $choiceStore = choice, $choiceStore);
    		}

    		if ($$self.$$.dirty[0] & /*filter*/ 64) {
    			set_store_value(filterStore, $filterStore = filter, $filterStore);
    		}

    		if ($$self.$$.dirty[0] & /*instance, choice, previousSelected, selected*/ 27263008) {
    			if (instance && choice && previousSelected !== selected) {
    				$$invalidate(24, previousSelected = selected);
    				instance.select(selected);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*instance, filter, selected, previousSelected, chips*/ 27263041) {
    			if (instance && filter) {
    				const setSelected = new Set(selected);
    				const unSelected = setDifference(previousSelected, setSelected);
    				const newSelected = setDifference(setSelected, previousSelected);

    				if (unSelected.size || newSelected.size) {
    					$$invalidate(24, previousSelected = setSelected);

    					for (let chipId of unSelected) {
    						if (chips.indexOf(chipId) !== -1) {
    							instance.handleChipSelection({ chipId, selected: false });
    						}
    					}

    					for (let chipId of newSelected) {
    						instance.handleChipSelection({ chipId, selected: true });
    					}
    				}
    			}
    		}
    	};

    	return [
    		chips,
    		use,
    		className,
    		key,
    		nonInteractive,
    		choice,
    		filter,
    		input,
    		element,
    		forwardEvents,
    		initialSelected,
    		nonInteractiveStore,
    		choiceStore,
    		filterStore,
    		handleChipMount,
    		handleChipUnmount,
    		handleChipInteraction,
    		handleChipSelection,
    		handleChipRemoval,
    		handleChipNavigation,
    		$$restProps,
    		selected,
    		getElement,
    		instance,
    		previousSelected,
    		slots,
    		div_binding,
    		$$scope
    	];
    }

    class Set_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance_1$1,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				use: 1,
    				class: 2,
    				chips: 0,
    				key: 3,
    				selected: 21,
    				nonInteractive: 4,
    				choice: 5,
    				filter: 6,
    				input: 7,
    				getElement: 22
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Set_1",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get use() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chips() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chips(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nonInteractive() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nonInteractive(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choice() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choice(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<Set>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[22];
    	}

    	set getElement(value) {
    		throw new Error("<Set>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\chips\dist\Checkmark.svelte generated by Svelte v3.46.4 */
    const file$4 = "node_modules\\@smui\\chips\\dist\\Checkmark.svelte";

    function create_fragment$4(ctx) {
    	let span;
    	let svg;
    	let path;
    	let span_class_value;
    	let useActions_action;
    	let mounted;
    	let dispose;

    	let span_levels = [
    		{
    			class: span_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-chip__checkmark': true
    			})
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "class", "mdc-chip__checkmark-path");
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "stroke", "black");
    			attr_dev(path, "d", "M1.73,12.91 8.1,19.28 22.79,4.59");
    			add_location(path, file$4, 10, 4, 220);
    			attr_dev(svg, "class", "mdc-chip__checkmark-svg");
    			attr_dev(svg, "viewBox", "-2 -3 30 30");
    			add_location(svg, file$4, 9, 2, 156);
    			set_attributes(span, span_data);
    			add_location(span, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, path);
    			/*span_binding*/ ctx[5](span);

    			if (!mounted) {
    				dispose = action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*className*/ 2 && span_class_value !== (span_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-chip__checkmark': true
    				})) && { class: span_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			/*span_binding*/ ctx[5](null);
    			mounted = false;
    			dispose();
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

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkmark', slots, []);
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let element;

    	function getElement() {
    		return element;
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({
    		classMap,
    		useActions,
    		use,
    		className,
    		element,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [use, className, element, $$restProps, getElement, span_binding];
    }

    class Checkmark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, { use: 0, class: 1, getElement: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkmark",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get use() {
    		throw new Error("<Checkmark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Checkmark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Checkmark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkmark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[4];
    	}

    	set getElement(value) {
    		throw new Error("<Checkmark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\chips\dist\Text.svelte generated by Svelte v3.46.4 */
    const file$3 = "node_modules\\@smui\\chips\\dist\\Text.svelte";

    // (1:0) {#if $filter}
    function create_if_block_1(ctx) {
    	let checkmark;
    	let current;
    	let checkmark_props = {};
    	checkmark = new Checkmark({ props: checkmark_props, $$inline: true });
    	/*checkmark_binding*/ ctx[22](checkmark);

    	const block = {
    		c: function create() {
    			create_component(checkmark.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(checkmark, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const checkmark_changes = {};
    			checkmark.$set(checkmark_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(checkmark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(checkmark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*checkmark_binding*/ ctx[22](null);
    			destroy_component(checkmark, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1:0) {#if $filter}",
    		ctx
    	});

    	return block;
    }

    // (12:2) {:else}
    function create_else_block(ctx) {
    	let span1;
    	let span0;
    	let span1_class_value;
    	let span1_role_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	let span1_levels = [
    		{
    			class: span1_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-chip__primary-action': true
    			})
    		},
    		{
    			role: span1_role_value = /*$filter*/ ctx[7]
    			? 'checkbox'
    			: /*$choice*/ ctx[9] ? 'radio' : 'button'
    		},
    		/*$filter*/ ctx[7] || /*$choice*/ ctx[9]
    		? {
    				'aria-selected': /*$isSelected*/ ctx[10] ? 'true' : 'false'
    			}
    		: {},
    		{ tabindex: /*tabindex*/ ctx[2] },
    		/*internalAttrs*/ ctx[6],
    		/*$$restProps*/ ctx[16]
    	];

    	let span1_data = {};

    	for (let i = 0; i < span1_levels.length; i += 1) {
    		span1_data = assign(span1_data, span1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span0, "class", "mdc-chip__text");
    			add_location(span0, file$3, 24, 23, 608);
    			set_attributes(span1, span1_data);
    			add_location(span1, file$3, 12, 4, 232);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			/*span1_binding*/ ctx[23](span1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span1, span1_data = get_spread_update(span1_levels, [
    				(!current || dirty & /*className*/ 2 && span1_class_value !== (span1_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-chip__primary-action': true
    				}))) && { class: span1_class_value },
    				(!current || dirty & /*$filter, $choice*/ 640 && span1_role_value !== (span1_role_value = /*$filter*/ ctx[7]
    				? 'checkbox'
    				: /*$choice*/ ctx[9] ? 'radio' : 'button')) && { role: span1_role_value },
    				dirty & /*$filter, $choice, $isSelected*/ 1664 && (/*$filter*/ ctx[7] || /*$choice*/ ctx[9]
    				? {
    						'aria-selected': /*$isSelected*/ ctx[10] ? 'true' : 'false'
    					}
    				: {}),
    				(!current || dirty & /*tabindex*/ 4) && { tabindex: /*tabindex*/ ctx[2] },
    				dirty & /*internalAttrs*/ 64 && /*internalAttrs*/ ctx[6],
    				dirty & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (default_slot) default_slot.d(detaching);
    			/*span1_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(12:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if $nonInteractive}
    function create_if_block$2(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "mdc-chip__text");
    			add_location(span, file$3, 10, 4, 173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(10:2) {#if $nonInteractive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let t;
    	let span;
    	let current_block_type_index;
    	let if_block1;
    	let useActions_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$filter*/ ctx[7] && create_if_block_1(ctx);
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$nonInteractive*/ ctx[8]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			span = element("span");
    			if_block1.c();
    			attr_dev(span, "role", "gridcell");
    			add_location(span, file$3, 3, 0, 54);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, span, anchor);
    			if_blocks[current_block_type_index].m(span, null);
    			/*span_binding*/ ctx[24](span);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[11].call(null, span))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$filter*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$filter*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(span, null);
    			}

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
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
    			if (detaching) detach_dev(span);
    			if_blocks[current_block_type_index].d();
    			/*span_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["use","class","tabindex","focus","getInput","getElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $filter;
    	let $nonInteractive;
    	let $choice;
    	let $isSelected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { tabindex = getContext('SMUI:chips:chip:focusable') ? 0 : -1 } = $$props;
    	let element;
    	let input = undefined;
    	let primaryAction = undefined;
    	let internalAttrs = {};
    	const nonInteractive = getContext('SMUI:chips:nonInteractive');
    	validate_store(nonInteractive, 'nonInteractive');
    	component_subscribe($$self, nonInteractive, value => $$invalidate(8, $nonInteractive = value));
    	const choice = getContext('SMUI:chips:choice');
    	validate_store(choice, 'choice');
    	component_subscribe($$self, choice, value => $$invalidate(9, $choice = value));
    	const filter = getContext('SMUI:chips:filter');
    	validate_store(filter, 'filter');
    	component_subscribe($$self, filter, value => $$invalidate(7, $filter = value));
    	const isSelected = getContext('SMUI:chips:chip:isSelected');
    	validate_store(isSelected, 'isSelected');
    	component_subscribe($$self, isSelected, value => $$invalidate(10, $isSelected = value));

    	onMount(() => {
    		let accessor = { focus, addAttr };
    		dispatch(getElement(), 'SMUIChipsChipPrimaryAction:mount', accessor);

    		return () => {
    			dispatch(getElement(), 'SMUIChipsChipPrimaryAction:unmount', accessor);
    		};
    	});

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(6, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function waitForTabindex(fn) {
    		if (internalAttrs['tabindex'] !== element.getAttribute('tabindex')) {
    			tick().then(fn);
    		} else {
    			fn();
    		}
    	}

    	function focus() {
    		// Let the tabindex change propagate.
    		waitForTabindex(() => {
    			primaryAction && primaryAction.focus();
    		});
    	}

    	function getInput() {
    		return input && input.getElement();
    	}

    	function getElement() {
    		return element;
    	}

    	function checkmark_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(4, input);
    		});
    	}

    	function span1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			primaryAction = $$value;
    			$$invalidate(5, primaryAction);
    		});
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(3, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('tabindex' in $$new_props) $$invalidate(2, tabindex = $$new_props.tabindex);
    		if ('$$scope' in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getContext,
    		tick,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		useActions,
    		dispatch,
    		Checkmark,
    		forwardEvents,
    		use,
    		className,
    		tabindex,
    		element,
    		input,
    		primaryAction,
    		internalAttrs,
    		nonInteractive,
    		choice,
    		filter,
    		isSelected,
    		addAttr,
    		waitForTabindex,
    		focus,
    		getInput,
    		getElement,
    		$filter,
    		$nonInteractive,
    		$choice,
    		$isSelected
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('tabindex' in $$props) $$invalidate(2, tabindex = $$new_props.tabindex);
    		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
    		if ('input' in $$props) $$invalidate(4, input = $$new_props.input);
    		if ('primaryAction' in $$props) $$invalidate(5, primaryAction = $$new_props.primaryAction);
    		if ('internalAttrs' in $$props) $$invalidate(6, internalAttrs = $$new_props.internalAttrs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		tabindex,
    		element,
    		input,
    		primaryAction,
    		internalAttrs,
    		$filter,
    		$nonInteractive,
    		$choice,
    		$isSelected,
    		forwardEvents,
    		nonInteractive,
    		choice,
    		filter,
    		isSelected,
    		$$restProps,
    		focus,
    		getInput,
    		getElement,
    		$$scope,
    		slots,
    		checkmark_binding,
    		span1_binding,
    		span_binding
    	];
    }

    class Text$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$3, safe_not_equal, {
    			use: 0,
    			class: 1,
    			tabindex: 2,
    			focus: 17,
    			getInput: 18,
    			getElement: 19
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get use() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[17];
    	}

    	set focus(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getInput() {
    		return this.$$.ctx[18];
    	}

    	set getInput(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[19];
    	}

    	set getElement(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\@smui\chips\dist\TrailingAction.svelte generated by Svelte v3.46.4 */
    const file$2 = "node_modules\\@smui\\chips\\dist\\TrailingAction.svelte";

    // (29:2) {#if touch}
    function create_if_block$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "mdc-deprecated-chip-trailing-action__touch");
    			add_location(span, file$2, 29, 4, 763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(29:2) {#if touch}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let button;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let span1_class_value;
    	let useActions_action;
    	let button_class_value;
    	let button_style_value;
    	let button_aria_hidden_value;
    	let Ripple_action;
    	let useActions_action_1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*touch*/ ctx[4] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	let span1_levels = [
    		{
    			class: span1_class_value = classMap({
    				[/*icon$class*/ ctx[7]]: true,
    				'mdc-deprecated-chip-trailing-action__icon': true
    			})
    		},
    		prefixFilter(/*$$restProps*/ ctx[17], 'icon$')
    	];

    	let span1_data = {};

    	for (let i = 0; i < span1_levels.length; i += 1) {
    		span1_data = assign(span1_data, span1_levels[i]);
    	}

    	let button_levels = [
    		{
    			class: button_class_value = classMap({
    				[/*className*/ ctx[1]]: true,
    				'mdc-deprecated-chip-trailing-action': true,
    				.../*internalClasses*/ ctx[10]
    			})
    		},
    		{
    			style: button_style_value = Object.entries(/*internalStyles*/ ctx[11]).map(func).concat([/*style*/ ctx[2]]).join(' ')
    		},
    		{
    			"aria-hidden": button_aria_hidden_value = /*nonNavigable*/ ctx[5] ? 'true' : undefined
    		},
    		{ tabindex: "-1" },
    		/*internalAttrs*/ ctx[12],
    		exclude(/*$$restProps*/ ctx[17], ['icon$'])
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			span0 = element("span");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			span1 = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span0, "class", "mdc-deprecated-chip-trailing-action__ripple");
    			add_location(span0, file$2, 27, 2, 684);
    			set_attributes(span1, span1_data);
    			add_location(span1, file$2, 31, 2, 833);
    			set_attributes(button, button_data);
    			add_location(button, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, span0);
    			append_dev(button, t0);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t1);
    			append_dev(button, span1);

    			if (default_slot) {
    				default_slot.m(span1, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[24](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(useActions_action = useActions.call(null, span1, /*icon$use*/ ctx[6])),
    					action_destroyer(Ripple_action = Ripple.call(null, button, {
    						ripple: /*ripple*/ ctx[3],
    						unbounded: false,
    						addClass: /*addClass*/ ctx[14],
    						removeClass: /*removeClass*/ ctx[15],
    						addStyle: /*addStyle*/ ctx[16]
    					})),
    					action_destroyer(useActions_action_1 = useActions.call(null, button, /*use*/ ctx[0])),
    					action_destroyer(/*forwardEvents*/ ctx[13].call(null, button)),
    					listen_dev(button, "click", /*click_handler*/ ctx[25], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*touch*/ ctx[4]) {
    				if (if_block) ; else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(button, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span1, span1_data = get_spread_update(span1_levels, [
    				(!current || dirty & /*icon$class*/ 128 && span1_class_value !== (span1_class_value = classMap({
    					[/*icon$class*/ ctx[7]]: true,
    					'mdc-deprecated-chip-trailing-action__icon': true
    				}))) && { class: span1_class_value },
    				dirty & /*$$restProps*/ 131072 && prefixFilter(/*$$restProps*/ ctx[17], 'icon$')
    			]));

    			if (useActions_action && is_function(useActions_action.update) && dirty & /*icon$use*/ 64) useActions_action.update.call(null, /*icon$use*/ ctx[6]);

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty & /*className, internalClasses*/ 1026 && button_class_value !== (button_class_value = classMap({
    					[/*className*/ ctx[1]]: true,
    					'mdc-deprecated-chip-trailing-action': true,
    					.../*internalClasses*/ ctx[10]
    				}))) && { class: button_class_value },
    				(!current || dirty & /*internalStyles, style*/ 2052 && button_style_value !== (button_style_value = Object.entries(/*internalStyles*/ ctx[11]).map(func).concat([/*style*/ ctx[2]]).join(' '))) && { style: button_style_value },
    				(!current || dirty & /*nonNavigable*/ 32 && button_aria_hidden_value !== (button_aria_hidden_value = /*nonNavigable*/ ctx[5] ? 'true' : undefined)) && { "aria-hidden": button_aria_hidden_value },
    				{ tabindex: "-1" },
    				dirty & /*internalAttrs*/ 4096 && /*internalAttrs*/ ctx[12],
    				dirty & /*$$restProps*/ 131072 && exclude(/*$$restProps*/ ctx[17], ['icon$'])
    			]));

    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 8) Ripple_action.update.call(null, {
    				ripple: /*ripple*/ ctx[3],
    				unbounded: false,
    				addClass: /*addClass*/ ctx[14],
    				removeClass: /*removeClass*/ ctx[15],
    				addStyle: /*addStyle*/ ctx[16]
    			});

    			if (useActions_action_1 && is_function(useActions_action_1.update) && dirty & /*use*/ 1) useActions_action_1.update.call(null, /*use*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
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

    const func = ([name, value]) => `${name}: ${value};`;

    function instance_1($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"use","class","style","ripple","touch","nonNavigable","icon$use","icon$class","isNavigable","focus","removeFocus","getElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TrailingAction', slots, ['default']);
    	const { MDCChipTrailingActionFoundation } = deprecated;
    	const forwardEvents = forwardEventsBuilder(get_current_component());
    	let { use = [] } = $$props;
    	let { class: className = '' } = $$props;
    	let { style = '' } = $$props;
    	let { ripple = true } = $$props;
    	let { touch = false } = $$props;
    	let { nonNavigable = false } = $$props;
    	let { icon$use = [] } = $$props;
    	let { icon$class = '' } = $$props;
    	let element;
    	let instance;
    	let internalClasses = {};
    	let internalStyles = {};
    	let internalAttrs = {};

    	onMount(() => {
    		$$invalidate(9, instance = new MDCChipTrailingActionFoundation({
    				focus: () => {
    					const element = getElement();

    					// Let the tabindex change propagate.
    					waitForTabindex(() => {
    						element.focus();
    					});
    				},
    				getAttribute: getAttr,
    				notifyInteraction: trigger => dispatch(getElement(), 'SMUIChipTrailingAction:interaction', { trigger }, undefined, true),
    				notifyNavigation: key => {
    					dispatch(getElement(), 'SMUIChipTrailingAction:navigation', { key }, undefined, true);
    				},
    				setAttribute: addAttr
    			}));

    		const accessor = { isNavigable, focus, removeFocus };
    		dispatch(getElement(), 'SMUIChipsChipTrailingAction:mount', accessor);
    		instance.init();

    		return () => {
    			dispatch(getElement(), 'SMUIChipsChipTrailingAction:unmount', accessor);
    			instance.destroy();
    		};
    	});

    	function addClass(className) {
    		if (!internalClasses[className]) {
    			$$invalidate(10, internalClasses[className] = true, internalClasses);
    		}
    	}

    	function removeClass(className) {
    		if (!(className in internalClasses) || internalClasses[className]) {
    			$$invalidate(10, internalClasses[className] = false, internalClasses);
    		}
    	}

    	function addStyle(name, value) {
    		if (internalStyles[name] != value) {
    			if (value === '' || value == null) {
    				delete internalStyles[name];
    				$$invalidate(11, internalStyles);
    			} else {
    				$$invalidate(11, internalStyles[name] = value, internalStyles);
    			}
    		}
    	}

    	function getAttr(name) {
    		var _a;

    		return name in internalAttrs
    		? (_a = internalAttrs[name]) !== null && _a !== void 0
    			? _a
    			: null
    		: getElement().getAttribute(name);
    	}

    	function addAttr(name, value) {
    		if (internalAttrs[name] !== value) {
    			$$invalidate(12, internalAttrs[name] = value, internalAttrs);
    		}
    	}

    	function waitForTabindex(fn) {
    		if (internalAttrs['tabindex'] !== element.getAttribute('tabindex')) {
    			tick().then(fn);
    		} else {
    			fn();
    		}
    	}

    	function isNavigable() {
    		return instance.isNavigable();
    	}

    	function focus() {
    		instance.focus();
    	}

    	function removeFocus() {
    		instance.removeFocus();
    	}

    	function getElement() {
    		return element;
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(8, element);
    		});
    	}

    	const click_handler = event => instance && instance.handleClick(event);
    	const keydown_handler = event => instance && instance.handleKeydown(event);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('style' in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$new_props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('touch' in $$new_props) $$invalidate(4, touch = $$new_props.touch);
    		if ('nonNavigable' in $$new_props) $$invalidate(5, nonNavigable = $$new_props.nonNavigable);
    		if ('icon$use' in $$new_props) $$invalidate(6, icon$use = $$new_props.icon$use);
    		if ('icon$class' in $$new_props) $$invalidate(7, icon$class = $$new_props.icon$class);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		deprecated,
    		onMount,
    		tick,
    		get_current_component,
    		forwardEventsBuilder,
    		classMap,
    		exclude,
    		prefixFilter,
    		useActions,
    		dispatch,
    		Ripple,
    		MDCChipTrailingActionFoundation,
    		forwardEvents,
    		use,
    		className,
    		style,
    		ripple,
    		touch,
    		nonNavigable,
    		icon$use,
    		icon$class,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		addClass,
    		removeClass,
    		addStyle,
    		getAttr,
    		addAttr,
    		waitForTabindex,
    		isNavigable,
    		focus,
    		removeFocus,
    		getElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('style' in $$props) $$invalidate(2, style = $$new_props.style);
    		if ('ripple' in $$props) $$invalidate(3, ripple = $$new_props.ripple);
    		if ('touch' in $$props) $$invalidate(4, touch = $$new_props.touch);
    		if ('nonNavigable' in $$props) $$invalidate(5, nonNavigable = $$new_props.nonNavigable);
    		if ('icon$use' in $$props) $$invalidate(6, icon$use = $$new_props.icon$use);
    		if ('icon$class' in $$props) $$invalidate(7, icon$class = $$new_props.icon$class);
    		if ('element' in $$props) $$invalidate(8, element = $$new_props.element);
    		if ('instance' in $$props) $$invalidate(9, instance = $$new_props.instance);
    		if ('internalClasses' in $$props) $$invalidate(10, internalClasses = $$new_props.internalClasses);
    		if ('internalStyles' in $$props) $$invalidate(11, internalStyles = $$new_props.internalStyles);
    		if ('internalAttrs' in $$props) $$invalidate(12, internalAttrs = $$new_props.internalAttrs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		use,
    		className,
    		style,
    		ripple,
    		touch,
    		nonNavigable,
    		icon$use,
    		icon$class,
    		element,
    		instance,
    		internalClasses,
    		internalStyles,
    		internalAttrs,
    		forwardEvents,
    		addClass,
    		removeClass,
    		addStyle,
    		$$restProps,
    		isNavigable,
    		focus,
    		removeFocus,
    		getElement,
    		$$scope,
    		slots,
    		button_binding,
    		click_handler,
    		keydown_handler
    	];
    }

    class TrailingAction$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance_1, create_fragment$2, safe_not_equal, {
    			use: 0,
    			class: 1,
    			style: 2,
    			ripple: 3,
    			touch: 4,
    			nonNavigable: 5,
    			icon$use: 6,
    			icon$class: 7,
    			isNavigable: 18,
    			focus: 19,
    			removeFocus: 20,
    			getElement: 21
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TrailingAction",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get use() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set use(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get touch() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set touch(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nonNavigable() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nonNavigable(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon$use() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon$use(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon$class() {
    		throw new Error("<TrailingAction>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon$class(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isNavigable() {
    		return this.$$.ctx[18];
    	}

    	set isNavigable(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		return this.$$.ctx[19];
    	}

    	set focus(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get removeFocus() {
    		return this.$$.ctx[20];
    	}

    	set removeFocus(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getElement() {
    		return this.$$.ctx[21];
    	}

    	set getElement(value) {
    		throw new Error("<TrailingAction>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const Set$1 = Set_1;
    const Text = Text$1;
    const TrailingAction = TrailingAction$1;

    /* src\AssignBrief.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$1 = "src\\AssignBrief.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    // (152:28) <Text>
    function create_default_slot_3(ctx) {
    	let t_value = /*chip*/ ctx[33] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*chip*/ 4 && t_value !== (t_value = /*chip*/ ctx[33] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(152:28) <Text>",
    		ctx
    	});

    	return block;
    }

    // (153:28) <TrailingAction icon$class="material-icons">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("cancel");
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(153:28) <TrailingAction icon$class=\\\"material-icons\\\">",
    		ctx
    	});

    	return block;
    }

    // (151:24) <Chip {chip}>
    function create_default_slot_1(ctx) {
    	let text_1;
    	let t;
    	let trailingaction;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	trailingaction = new TrailingAction({
    			props: {
    				icon$class: "material-icons",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    			t = space();
    			create_component(trailingaction.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(trailingaction, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty[1] & /*$$scope, chip*/ 12) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    			const trailingaction_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				trailingaction_changes.$$scope = { dirty, ctx };
    			}

    			trailingaction.$set(trailingaction_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			transition_in(trailingaction.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			transition_out(trailingaction.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(trailingaction, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(151:24) <Chip {chip}>",
    		ctx
    	});

    	return block;
    }

    // (150:20) <Set chips={selected_learners} let:chip input>
    function create_default_slot(ctx) {
    	let chip;
    	let current;

    	chip = new Chip({
    			props: {
    				chip: /*chip*/ ctx[33],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chip_changes = {};
    			if (dirty[1] & /*chip*/ 4) chip_changes.chip = /*chip*/ ctx[33];

    			if (dirty[1] & /*$$scope, chip*/ 12) {
    				chip_changes.$$scope = { dirty, ctx };
    			}

    			chip.$set(chip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(150:20) <Set chips={selected_learners} let:chip input>",
    		ctx
    	});

    	return block;
    }

    // (157:24) {#each learner_names_sorted as learner}
    function create_each_block_2(ctx) {
    	let option;
    	let t_value = /*learner*/ ctx[30] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*learner*/ ctx[30];
    			option.value = option.__value;
    			add_location(option, file$1, 157, 24, 5638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*learner_names_sorted*/ 128 && t_value !== (t_value = /*learner*/ ctx[30] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*learner_names_sorted*/ 128 && option_value_value !== (option_value_value = /*learner*/ ctx[30])) {
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
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(157:24) {#each learner_names_sorted as learner}",
    		ctx
    	});

    	return block;
    }

    // (169:20) {#each selected_reviewers as reviewer}
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*reviewer*/ ctx[25] + ", " + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$1, 169, 20, 6278);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selected_reviewers*/ 32 && t_value !== (t_value = /*reviewer*/ ctx[25] + ", " + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(169:20) {#each selected_reviewers as reviewer}",
    		ctx
    	});

    	return block;
    }

    // (173:24) {#each reviewer_names_sorted as reviewer}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*reviewer*/ ctx[25] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*reviewer*/ ctx[25];
    			option.value = option.__value;
    			add_location(option, file$1, 173, 24, 6481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*reviewer_names_sorted*/ 256 && t_value !== (t_value = /*reviewer*/ ctx[25] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*reviewer_names_sorted*/ 256 && option_value_value !== (option_value_value = /*reviewer*/ ctx[25])) {
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
    		source: "(173:24) {#each reviewer_names_sorted as reviewer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div8;
    	let div7;
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
    	let div3;
    	let input2;
    	let t10;
    	let div2;
    	let t12;
    	let set;
    	let t13;
    	let datalist0;
    	let t14;
    	let section3;
    	let label3;
    	let t16;
    	let div5;
    	let input3;
    	let t17;
    	let div4;
    	let t19;
    	let t20;
    	let datalist1;
    	let t21;
    	let section4;
    	let label4;
    	let t23;
    	let input4;
    	let t24;
    	let section5;
    	let label5;
    	let t26;
    	let div6;
    	let label6;
    	let input5;
    	let t27;
    	let t28;
    	let label7;
    	let input6;
    	let t29;
    	let t30;
    	let section6;
    	let label8;
    	let t32;
    	let checklistselector;
    	let t33;
    	let section7;
    	let label9;
    	let t35;
    	let treeview;
    	let t36;
    	let input7;
    	let current;
    	let mounted;
    	let dispose;

    	set = new Set$1({
    			props: {
    				chips: /*selected_learners*/ ctx[6],
    				input: true,
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ chip }) => ({ 33: chip }),
    						({ chip }) => [0, chip ? 4 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_2 = /*learner_names_sorted*/ ctx[7];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*selected_reviewers*/ ctx[5];
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
    			div8 = element("div");
    			div7 = element("div");
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
    			div3 = element("div");
    			input2 = element("input");
    			t10 = space();
    			div2 = element("div");
    			div2.textContent = "Add a learner to the brief. (You can add multiple learners.)";
    			t12 = space();
    			create_component(set.$$.fragment);
    			t13 = space();
    			datalist0 = element("datalist");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t14 = space();
    			section3 = element("section");
    			label3 = element("label");
    			label3.textContent = "Reviewers";
    			t16 = space();
    			div5 = element("div");
    			input3 = element("input");
    			t17 = space();
    			div4 = element("div");
    			div4.textContent = "Add a reviewer to the brief. (You can add multiple reviewers.)";
    			t19 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t20 = space();
    			datalist1 = element("datalist");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t21 = space();
    			section4 = element("section");
    			label4 = element("label");
    			label4.textContent = "Submission deadline:";
    			t23 = space();
    			input4 = element("input");
    			t24 = space();
    			section5 = element("section");
    			label5 = element("label");
    			label5.textContent = "Asignment Type:";
    			t26 = space();
    			div6 = element("div");
    			label6 = element("label");
    			input5 = element("input");
    			t27 = text("\r\n                        Exemplar");
    			t28 = space();
    			label7 = element("label");
    			input6 = element("input");
    			t29 = text("\r\n                        Brief");
    			t30 = space();
    			section6 = element("section");
    			label8 = element("label");
    			label8.textContent = "Checklist items";
    			t32 = space();
    			create_component(checklistselector.$$.fragment);
    			t33 = space();
    			section7 = element("section");
    			label9 = element("label");
    			label9.textContent = "Checklist items";
    			t35 = space();
    			create_component(treeview.$$.fragment);
    			t36 = space();
    			input7 = element("input");
    			attr_dev(label0, "for", "brief-title");
    			attr_dev(label0, "class", "svelte-1xndmg5");
    			add_location(label0, file$1, 133, 16, 4114);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "brief-title");
    			attr_dev(input0, "class", "brief_title svelte-1xndmg5");
    			attr_dev(input0, "placeholder", "Add a title for the brief");
    			input0.required = true;
    			add_location(input0, file$1, 134, 16, 4177);
    			attr_dev(section0, "id", "title");
    			attr_dev(section0, "class", "svelte-1xndmg5");
    			add_location(section0, file$1, 132, 12, 4076);
    			attr_dev(label1, "for", "attach-brief");
    			attr_dev(label1, "class", "svelte-1xndmg5");
    			add_location(label1, file$1, 137, 16, 4388);
    			set_style(input1, "width", "100%");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "attach-brief");
    			attr_dev(input1, "id", "attach-brief");
    			input1.required = true;
    			add_location(input1, file$1, 139, 20, 4484);
    			add_location(div0, file$1, 140, 20, 4615);
    			attr_dev(div1, "class", "svelte-1xndmg5");
    			add_location(div1, file$1, 138, 16, 4457);
    			attr_dev(section1, "id", "drive_link");
    			attr_dev(section1, "class", "svelte-1xndmg5");
    			add_location(section1, file$1, 136, 12, 4345);
    			attr_dev(label2, "for", "learner");
    			attr_dev(label2, "class", "svelte-1xndmg5");
    			add_location(label2, file$1, 144, 16, 4819);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "learners");
    			attr_dev(input2, "class", "learner");
    			attr_dev(input2, "placeholder", "Add a learner");
    			input2.required = true;
    			attr_dev(input2, "list", "learner-list");
    			add_location(input2, file$1, 146, 20, 4910);
    			add_location(div2, file$1, 148, 20, 5112);
    			attr_dev(datalist0, "id", "learner-list");
    			add_location(datalist0, file$1, 155, 20, 5519);
    			attr_dev(div3, "class", "svelte-1xndmg5");
    			add_location(div3, file$1, 145, 16, 4883);
    			attr_dev(section2, "id", "learner");
    			attr_dev(section2, "class", "svelte-1xndmg5");
    			add_location(section2, file$1, 143, 12, 4779);
    			attr_dev(label3, "for", "learner");
    			attr_dev(label3, "class", "svelte-1xndmg5");
    			add_location(label3, file$1, 163, 16, 5833);
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "id", "reviewers");
    			attr_dev(input3, "class", "reviewer");
    			attr_dev(input3, "placeholder", "Add a reviewer");
    			input3.required = true;
    			attr_dev(input3, "list", "reviewer-list");
    			add_location(input3, file$1, 165, 20, 5916);
    			add_location(div4, file$1, 167, 20, 6123);
    			attr_dev(datalist1, "id", "reviewer-list");
    			add_location(datalist1, file$1, 171, 20, 6359);
    			attr_dev(div5, "class", "svelte-1xndmg5");
    			add_location(div5, file$1, 164, 16, 5889);
    			attr_dev(section3, "id", "reviewer");
    			attr_dev(section3, "class", "svelte-1xndmg5");
    			add_location(section3, file$1, 162, 12, 5792);
    			attr_dev(label4, "for", "submission-datetime");
    			attr_dev(label4, "class", "svelte-1xndmg5");
    			add_location(label4, file$1, 180, 16, 6679);
    			attr_dev(input4, "id", "submission-datetime");
    			attr_dev(input4, "type", "datetime-local");
    			attr_dev(input4, "class", "svelte-1xndmg5");
    			add_location(input4, file$1, 181, 16, 6758);
    			attr_dev(section4, "id", "deadline");
    			attr_dev(section4, "class", "svelte-1xndmg5");
    			add_location(section4, file$1, 179, 12, 6638);
    			attr_dev(label5, "for", "submission-datetime");
    			attr_dev(label5, "class", "svelte-1xndmg5");
    			add_location(label5, file$1, 185, 16, 6900);
    			attr_dev(input5, "type", "radio");
    			attr_dev(input5, "id", "exemplar");
    			attr_dev(input5, "name", "brief_type");
    			input5.__value = "exemplar";
    			input5.value = input5.__value;
    			/*$$binding_groups*/ ctx[19][0].push(input5);
    			add_location(input5, file$1, 188, 24, 7078);
    			attr_dev(label6, "class", "radio");
    			attr_dev(label6, "for", "exemplar");
    			add_location(label6, file$1, 187, 20, 7016);
    			attr_dev(input6, "type", "radio");
    			attr_dev(input6, "id", "brief");
    			attr_dev(input6, "name", "brief_type");
    			input6.__value = "brief";
    			input6.value = input6.__value;
    			/*$$binding_groups*/ ctx[19][0].push(input6);
    			add_location(input6, file$1, 192, 24, 7301);
    			attr_dev(label7, "class", "radio");
    			attr_dev(label7, "for", "brief");
    			add_location(label7, file$1, 191, 20, 7242);
    			attr_dev(div6, "class", "radios svelte-1xndmg5");
    			add_location(div6, file$1, 186, 16, 6974);
    			attr_dev(section5, "id", "assignment_type");
    			attr_dev(section5, "class", "svelte-1xndmg5");
    			add_location(section5, file$1, 184, 12, 6852);
    			attr_dev(label8, "for", "");
    			attr_dev(label8, "class", "svelte-1xndmg5");
    			add_location(label8, file$1, 197, 16, 7536);
    			attr_dev(section6, "id", "checklist");
    			attr_dev(section6, "class", "svelte-1xndmg5");
    			add_location(section6, file$1, 196, 12, 7494);
    			attr_dev(label9, "for", "");
    			attr_dev(label9, "class", "svelte-1xndmg5");
    			add_location(label9, file$1, 201, 24, 7724);
    			attr_dev(section7, "id", "checklist");
    			attr_dev(section7, "class", "svelte-1xndmg5");
    			add_location(section7, file$1, 200, 20, 7674);
    			attr_dev(input7, "id", "submit");
    			attr_dev(input7, "type", "button");
    			input7.value = "Submit";
    			add_location(input7, file$1, 205, 20, 7999);
    			add_location(form, file$1, 131, 8, 4022);
    			attr_dev(div7, "id", "assign-brief");
    			attr_dev(div7, "class", "outer_shell");
    			add_location(div7, file$1, 130, 4, 3967);
    			add_location(div8, file$1, 129, 0, 3956);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, form);
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
    			append_dev(section2, div3);
    			append_dev(div3, input2);
    			append_dev(div3, t10);
    			append_dev(div3, div2);
    			append_dev(div3, t12);
    			mount_component(set, div3, null);
    			append_dev(div3, t13);
    			append_dev(div3, datalist0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(datalist0, null);
    			}

    			append_dev(form, t14);
    			append_dev(form, section3);
    			append_dev(section3, label3);
    			append_dev(section3, t16);
    			append_dev(section3, div5);
    			append_dev(div5, input3);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div5, t19);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div5, t20);
    			append_dev(div5, datalist1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(datalist1, null);
    			}

    			append_dev(form, t21);
    			append_dev(form, section4);
    			append_dev(section4, label4);
    			append_dev(section4, t23);
    			append_dev(section4, input4);
    			append_dev(form, t24);
    			append_dev(form, section5);
    			append_dev(section5, label5);
    			append_dev(section5, t26);
    			append_dev(section5, div6);
    			append_dev(div6, label6);
    			append_dev(label6, input5);
    			input5.checked = input5.__value === /*assignmentType*/ ctx[4];
    			append_dev(label6, t27);
    			append_dev(div6, t28);
    			append_dev(div6, label7);
    			append_dev(label7, input6);
    			input6.checked = input6.__value === /*assignmentType*/ ctx[4];
    			append_dev(label7, t29);
    			append_dev(form, t30);
    			append_dev(form, section6);
    			append_dev(section6, label8);
    			append_dev(section6, t32);
    			mount_component(checklistselector, section6, null);
    			append_dev(form, t33);
    			append_dev(form, section7);
    			append_dev(section7, label9);
    			append_dev(section7, t35);
    			mount_component(treeview, section7, null);
    			append_dev(form, t36);
    			append_dev(form, input7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[14]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[15]),
    					listen_dev(input2, "change", /*change_handler*/ ctx[16], false, false, false),
    					listen_dev(input3, "change", /*change_handler_1*/ ctx[17], false, false, false),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[18]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[20]),
    					listen_dev(form, "submit", prevent_default(/*submit*/ ctx[11]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*brief_title*/ 4 && input0.value !== /*brief_title*/ ctx[2]) {
    				set_input_value(input0, /*brief_title*/ ctx[2]);
    			}

    			if (dirty[0] & /*brief_link*/ 8 && input1.value !== /*brief_link*/ ctx[3]) {
    				set_input_value(input1, /*brief_link*/ ctx[3]);
    			}

    			const set_changes = {};
    			if (dirty[0] & /*selected_learners*/ 64) set_changes.chips = /*selected_learners*/ ctx[6];

    			if (dirty[1] & /*$$scope, chip*/ 12) {
    				set_changes.$$scope = { dirty, ctx };
    			}

    			set.$set(set_changes);

    			if (dirty[0] & /*learner_names_sorted*/ 128) {
    				each_value_2 = /*learner_names_sorted*/ ctx[7];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(datalist0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty[0] & /*selected_reviewers*/ 32) {
    				each_value_1 = /*selected_reviewers*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div5, t20);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty[0] & /*reviewer_names_sorted*/ 256) {
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
    						each_blocks[i].m(datalist1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*assignmentType*/ 16) {
    				input5.checked = input5.__value === /*assignmentType*/ ctx[4];
    			}

    			if (dirty[0] & /*assignmentType*/ 16) {
    				input6.checked = input6.__value === /*assignmentType*/ ctx[4];
    			}

    			const checklistselector_changes = {};
    			if (dirty[0] & /*skills*/ 1) checklistselector_changes.skills = /*skills*/ ctx[0];
    			checklistselector.$set(checklistselector_changes);
    			const treeview_changes = {};
    			if (dirty[0] & /*skillsTree*/ 2) treeview_changes.branch = /*skillsTree*/ ctx[1];
    			treeview.$set(treeview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(set.$$.fragment, local);
    			transition_in(checklistselector.$$.fragment, local);
    			transition_in(treeview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(set.$$.fragment, local);
    			transition_out(checklistselector.$$.fragment, local);
    			transition_out(treeview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(set);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input5), 1);
    			/*$$binding_groups*/ ctx[19][0].splice(/*$$binding_groups*/ ctx[19][0].indexOf(input6), 1);
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
    	let learner_names_sorted = [];
    	let reviewer_names_sorted = [];

    	const addLearner = learner => {
    		if (learner_names_sorted.indexOf(learner) >= 0) {
    			// selected_learners = [...new Set(selected_learners.concat(learner))];
    			$$invalidate(6, selected_learners = [...selected_learners, learner]);
    		}
    	};

    	const addReviewer = reviewer => {
    		if (reviewer_names_sorted.indexOf(reviewer) >= 0) {
    			$$invalidate(5, selected_reviewers = [...new Set$1(selected_reviewers.concat(reviewer))]);
    		}
    	};

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

    	const change_handler = e => addLearner(e.target.value);
    	const change_handler_1 = e => addReviewer(e.target.value);

    	function input5_change_handler() {
    		assignmentType = this.__value;
    		$$invalidate(4, assignmentType);
    	}

    	function input6_change_handler() {
    		assignmentType = this.__value;
    		$$invalidate(4, assignmentType);
    	}

    	$$self.$$set = $$props => {
    		if ('learners' in $$props) $$invalidate(12, learners = $$props.learners);
    		if ('reviewers' in $$props) $$invalidate(13, reviewers = $$props.reviewers);
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('skillsTree' in $$props) $$invalidate(1, skillsTree = $$props.skillsTree);
    	};

    	$$self.$capture_state = () => ({
    		CheckListSelector,
    		TreeView,
    		Chip,
    		Set: Set$1,
    		TrailingAction,
    		Text,
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
    		addLearner,
    		addReviewer,
    		getChecked,
    		submit,
    		firstDictItemKey,
    		firstDictItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('learners' in $$props) $$invalidate(12, learners = $$props.learners);
    		if ('reviewers' in $$props) $$invalidate(13, reviewers = $$props.reviewers);
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
    		if ($$self.$$.dirty[0] & /*learners, reviewers*/ 12288) {
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
    		addLearner,
    		addReviewer,
    		submit,
    		learners,
    		reviewers,
    		input0_input_handler,
    		input1_input_handler,
    		change_handler,
    		change_handler_1,
    		input5_change_handler,
    		$$binding_groups,
    		input6_change_handler
    	];
    }

    class AssignBrief extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				learners: 12,
    				reviewers: 13,
    				skills: 0,
    				skillsTree: 1
    			},
    			null,
    			[-1, -1]
    		);

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

    const d = `{"learner_names":["Test1","Test5","Test3","TestC","Test2","TestF","Test4","TestE","B","A","TestA","TestG","TestB","TestD","Learner A","Test Student","Test Student2","N**** Mc****","K** Po***1","K** Po**2","K** Po**3","D**** O B****1","D**** O B****2","Reviewer A","A**** McG***"],"reviewer_names":["Test1","Test5","Test3","TestC","Test2","TestF","Test4","TestE","B","A","TestA","TestG","TestB","TestD","Learner A","Test Student","Test Student2","N**** Mc****","K** Po***1","K** Po**2","K** Po**3","D**** O B****1","D**** O B****2","Reviewer A","A**** McG***"],"skills_table":[["Organisation","Research aims or questions","Are the aims/research question(s) clear, precise and achievable?"],["Organisation","Research aims or questions","Are the verbs used to describe the aims aligned with the methodology used? (e.g. explore, measure, determine etc.)"],["Organisation","Research aims or questions","Are the aims of the research contextualised in a relevant way, e.g. in relation to developments in policy, practice and academic literature?"],["Organisation","Research aims or questions","Are sound reasons provided for having these aims as the focus of the research, e.g. gaps in academic literature, developments in policy or practice?"],["Organisation","Thesis statement","Is a concise summary of the main point or argument of the research provided?"],["Organisation","Focus","check2/check 3"],["Organisation","Paragraph structure","Are the paragraphs internally logical?"],["Organisation","Paragraph structure","Does the paragraph has a topic sentence and a concluding sentence?"],["Organisation","Ordering","check 4"],["Organisation","Signposting","is the reader guided through the text with link words, bridging etc."],["Organisation","Bridging/making small transitions","Are transitional words or phrases used within or between paragraphs to express similiarity or dissimilarity )e.g. likewise, in the same way, on the other hand, despite, in contrast)"],["Organisation","Bridging/making small transitions","Are transitional words or phrases used within or between paragraphs to indicate temporal (e.g. first, second, later, finally) or causal (e.g. accordingly, because, therefore) ordering?"],["Organisation","Bridging/making big transitions","Are transitional words or phrases used to remind the reader of what has earlier been argued (as previously mentioned, in short, on the whole)"],["Mechanics","Grammar","Is the grammar correct?"],["Style ","Clarity of language ","Does the author avoid overly long, poorly punctuated sentences?"],["Style ","Clarity of language ","Does the author avoid overly using niche jargon?"],["Style ","Clarity of language ","Are technical terms clearly explained?"],["Style ","Clarity of language ","Are abstract ideas anchored in concrete language and images?"],["Style ","Clarity of language ","Are abstract concepts illustrated with examples?"],["Style ","Use of sources ","Are all sources fully referenced?"],["Style ","Use of sources ","Are signal phrases (e.g. 'as Murphy illustrates') used to indicate that the author is introducing material taken from sources?"],["Style ","Use of sources ","Do the referenced sources align with the argument of the author?"],["Analysis","argument","Is the author's position clear?"],["Analysis","argument","Does the author offer sound evidence or reasoning in support of their position?"],["Analysis","methodology/research design","Are methodological choices clearly identified and explained?"],["Analysis","methodology/research design","Are methodological choices justified and critically analysed? "],["Analysis","methodology/research design","Is the researcher's positionality explained and its implications fully analysed?"],["Analysis","methodology/research design","Are all ethical considerations relevant to the project identified?"],["Analysis","methodology/research design","Are strategies in place to address all identified ethical issues?"],["Analysis","use of theory ","Are the theoretical concepts or frameworks underpinning the study clearly articulated?"],["Analysis","use of theory ","Are the theoretical concepts or frameworks underpinning the study critically analysed?"],["Analysis","use of theory ","Are the theoretical concepts or frameworks underpinning the study appropriate and convincing?"],["Formal","Author","Name of Author(s)"],["Content","Abstract","Does it give the central questions or statement of the problem the research addresses?"],["Content","Abstract","Does it summarise what\u2019s already known about this question, what previous research has done or shown"],["Content","Abstract","Does it provide the main reason(s), the exigency, the rationale, the goals for the research\u2014Why is it important to address these questions? (Why is that topic worth examining? Does it fill a gap in previous research? Apply new methods to take a fresh look at existing ideas or data? Resolving a dispute within the literature in the field? . . .)"],["Content","Abstract","Are the research questions clearly set out?"],["Content","Abstract","Does it explain work done so far and what is the plan (including possible research methods)?"],["Content","Abstract","Does it summarise the main findings, results, or arguments?"],["Content","Abstract","Is the significance or implications of  findings or arguments mentioned?"],["Content","Methodology1","Are the goals of the study are clearly defined"],["Content","Methodology1","Are the research question(s) clearly defined and can they potentially be answered with the data"],["Content","Methodology1","Are the hypotheses clear and can they potentially be supported by the data?"],["Content","Methodology1","Is the design clearly described?"],["Content","Methodology1","Is the design clearly justified?"],["Content","Methodology1","Is the operationalisation of constructs justified (e.g. using existing instruments)?"],["Content","Methodology1","Is the procedure clear and detailed enough to be carried out without any input from the researcher"],["Content","Methodology1","Is it written in the past tense?"],["Content","Lit review section 1","Is the area of interest explained?"],["Content","Lit review section 1","Is the purpose of the review made evident to the reader?"],["Content","Lit review section 1","If terminology or concepts are being introduced as part of the review, are these defined or clarified?"],["Content","Lit review section 1","Is the organization of the review made evident to the reader?"],["Content","Abstract2","Is the  gap or problem  or  main  issue the work focuses on clear?"],["Content","Abstract2","Is it clear why they went about  the work the way they did and how they did it?"],["Content","Abstract2","Is it clear what they found or created?"],["Content","Abstract2","Is the contribution this work makes to knowledge and meaning clear?"],["Content","Abstract2","Is it clear why the work matters?"],["Content","Abstract2","Overall, is the abstract clear?"],["Content","Abstract2_old","Is it more of  a summary  than  an  abstract? "],["Content","Abstract v3","Is the central question or statement of the problem clearly and precisely stated? "],["Content","Abstract v3","Does it summarise what\u2019s already known about this question/problem?  (What previous research has done or shown)"],["Content","Abstract v3","Does it provide the main reason(s) for doing the research? "],["Content","Abstract v3","Does it explain how the research was undertaken (e.g. research methods, approach,)"],["Content","Abstract v3","Does it summarise the main findings, results, or arguments?"],["Content","Abstract v3","Does it explain the significance or implication(s) of the findings or argument(s)? "],["Organisation","Paragraph structure v2","Is the topic sentence precise, brief, yet thorough?"],["Organisation","Paragraph structure v2","Does every idea relate to the topic sentence?"],["Organisation","Paragraph structure v2","Does the ordering of the ideas make sense?"],["Organisation","Paragraph structure v2","Is the topic sentence elaborated?"],["Organisation","Paragraph structure v2","Are link words used effectively to help the reader follow the ideas?"]]}`;

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
