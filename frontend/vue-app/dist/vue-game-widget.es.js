/**
* @vue/shared v3.5.14
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function We(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const B = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, mt = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], Y = () => {
}, Mr = () => !1, Bt = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ln = (e) => e.startsWith("onUpdate:"), G = Object.assign, co = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Fr = Object.prototype.hasOwnProperty, j = (e, t) => Fr.call(e, t), C = Array.isArray, it = (e) => bn(e) === "[object Map]", bs = (e) => bn(e) === "[object Set]", A = (e) => typeof e == "function", q = (e) => typeof e == "string", tt = (e) => typeof e == "symbol", K = (e) => e !== null && typeof e == "object", lo = (e) => (K(e) || A(e)) && A(e.then) && A(e.catch), Ns = Object.prototype.toString, bn = (e) => Ns.call(e), fo = (e) => bn(e).slice(8, -1), Nn = (e) => bn(e) === "[object Object]", uo = (e) => q(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Pt = /* @__PURE__ */ We(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), jr = /* @__PURE__ */ We(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
), yn = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Hr = /-(\w)/g, ae = yn(
  (e) => e.replace(Hr, (t, n) => n ? n.toUpperCase() : "")
), Lr = /\B([A-Z])/g, ge = yn(
  (e) => e.replace(Lr, "-$1").toLowerCase()
), On = yn((e) => e.charAt(0).toUpperCase() + e.slice(1)), st = yn(
  (e) => e ? `on${On(e)}` : ""
), ct = (e, t) => !Object.is(e, t), Dt = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, fn = (e, t, n, o = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: o,
    value: n
  });
}, Ur = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Mo = (e) => {
  const t = q(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let Fo;
const Wt = () => Fo || (Fo = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ao(e) {
  if (C(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const o = e[n], s = q(o) ? Kr(o) : ao(o);
      if (s)
        for (const r in s)
          t[r] = s[r];
    }
    return t;
  } else if (q(e) || K(e))
    return e;
}
const Br = /;(?![^(]*\))/g, Wr = /:([^]+)/, kr = /\/\*[^]*?\*\//g;
function Kr(e) {
  const t = {};
  return e.replace(kr, "").split(Br).forEach((n) => {
    if (n) {
      const o = n.split(Wr);
      o.length > 1 && (t[o[0].trim()] = o[1].trim());
    }
  }), t;
}
function po(e) {
  let t = "";
  if (q(e))
    t = e;
  else if (C(e))
    for (let n = 0; n < e.length; n++) {
      const o = po(e[n]);
      o && (t += o + " ");
    }
  else if (K(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const Gr = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", qr = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", Jr = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", zr = /* @__PURE__ */ We(Gr), Yr = /* @__PURE__ */ We(qr), Xr = /* @__PURE__ */ We(Jr), Zr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Qr = /* @__PURE__ */ We(Zr);
function ys(e) {
  return !!e || e === "";
}
const Os = (e) => !!(e && e.__v_isRef === !0), Kn = (e) => q(e) ? e : e == null ? "" : C(e) || K(e) && (e.toString === Ns || !A(e.toString)) ? Os(e) ? Kn(e.value) : JSON.stringify(e, xs, 2) : String(e), xs = (e, t) => Os(t) ? xs(e, t.value) : it(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [o, s], r) => (n[In(o, r) + " =>"] = s, n),
    {}
  )
} : bs(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => In(n))
} : tt(t) ? In(t) : K(t) && !C(t) && !Nn(t) ? String(t) : t, In = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    tt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.14
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function je(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let fe;
class ei {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = fe, !t && fe && (this.index = (fe.scopes || (fe.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = fe;
      try {
        return fe = this, t();
      } finally {
        fe = n;
      }
    } else process.env.NODE_ENV !== "production" && je("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = fe, fe = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (fe = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, o;
      for (n = 0, o = this.effects.length; n < o; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, o = this.cleanups.length; n < o; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, o = this.scopes.length; n < o; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const s = this.parent.scopes.pop();
        s && s !== this && (this.parent.scopes[this.index] = s, s.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function ti() {
  return fe;
}
let H;
const Rn = /* @__PURE__ */ new WeakSet();
class ws {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, fe && fe.active && fe.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Rn.has(this) && (Rn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Vs(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, jo(this), Ss(this);
    const t = H, n = xe;
    H = this, xe = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && H !== this && je(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Cs(this), H = t, xe = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        go(t);
      this.deps = this.depsTail = void 0, jo(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Rn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Gn(this) && this.run();
  }
  get dirty() {
    return Gn(this);
  }
}
let Ds = 0, $t, It;
function Vs(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = It, It = e;
    return;
  }
  e.next = $t, $t = e;
}
function ho() {
  Ds++;
}
function _o() {
  if (--Ds > 0)
    return;
  if (It) {
    let t = It;
    for (It = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; $t; ) {
    let t = $t;
    for ($t = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (o) {
          e || (e = o);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Ss(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Cs(e) {
  let t, n = e.depsTail, o = n;
  for (; o; ) {
    const s = o.prevDep;
    o.version === -1 ? (o === n && (n = s), go(o), ni(o)) : t = o, o.dep.activeLink = o.prevActiveLink, o.prevActiveLink = void 0, o = s;
  }
  e.deps = t, e.depsTail = n;
}
function Gn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ts(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ts(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ft) || (e.globalVersion = Ft, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Gn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = H, o = xe;
  H = e, xe = !0;
  try {
    Ss(e);
    const s = e.fn(e._value);
    (t.version === 0 || ct(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    H = n, xe = o, Cs(e), e.flags &= -3;
  }
}
function go(e, t = !1) {
  const { dep: n, prevSub: o, nextSub: s } = e;
  if (o && (o.nextSub = s, e.prevSub = void 0), s && (s.prevSub = o, e.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = o, !o && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      go(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function ni(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let xe = !0;
const As = [];
function De() {
  As.push(xe), xe = !1;
}
function Ve() {
  const e = As.pop();
  xe = e === void 0 ? !0 : e;
}
function jo(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = H;
    H = void 0;
    try {
      t();
    } finally {
      H = n;
    }
  }
}
let Ft = 0;
class oi {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ps {
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!H || !xe || H === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== H)
      n = this.activeLink = new oi(H, this), H.deps ? (n.prevDep = H.depsTail, H.depsTail.nextDep = n, H.depsTail = n) : H.deps = H.depsTail = n, $s(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const o = n.nextDep;
      o.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = o), n.prevDep = H.depsTail, n.nextDep = void 0, H.depsTail.nextDep = n, H.depsTail = n, H.deps === n && (H.deps = o);
    }
    return process.env.NODE_ENV !== "production" && H.onTrack && H.onTrack(
      G(
        {
          effect: H
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, Ft++, this.notify(t);
  }
  notify(t) {
    ho();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let n = this.subsHead; n; n = n.nextSub)
          n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
            G(
              {
                effect: n.sub
              },
              t
            )
          );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      _o();
    }
  }
}
function $s(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let o = t.deps; o; o = o.nextDep)
        $s(o);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const qn = /* @__PURE__ */ new WeakMap(), lt = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), Jn = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), jt = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function z(e, t, n) {
  if (xe && H) {
    let o = qn.get(e);
    o || qn.set(e, o = /* @__PURE__ */ new Map());
    let s = o.get(n);
    s || (o.set(n, s = new Ps()), s.map = o, s.key = n), process.env.NODE_ENV !== "production" ? s.track({
      target: e,
      type: t,
      key: n
    }) : s.track();
  }
}
function Re(e, t, n, o, s, r) {
  const i = qn.get(e);
  if (!i) {
    Ft++;
    return;
  }
  const c = (u) => {
    u && (process.env.NODE_ENV !== "production" ? u.trigger({
      target: e,
      type: t,
      key: n,
      newValue: o,
      oldValue: s,
      oldTarget: r
    }) : u.trigger());
  };
  if (ho(), t === "clear")
    i.forEach(c);
  else {
    const u = C(e), p = u && uo(n);
    if (u && n === "length") {
      const d = Number(o);
      i.forEach((a, _) => {
        (_ === "length" || _ === jt || !tt(_) && _ >= d) && c(a);
      });
    } else
      switch ((n !== void 0 || i.has(void 0)) && c(i.get(n)), p && c(i.get(jt)), t) {
        case "add":
          u ? p && c(i.get("length")) : (c(i.get(lt)), it(e) && c(i.get(Jn)));
          break;
        case "delete":
          u || (c(i.get(lt)), it(e) && c(i.get(Jn)));
          break;
        case "set":
          it(e) && c(i.get(lt));
          break;
      }
  }
  _o();
}
function pt(e) {
  const t = I(e);
  return t === e ? t : (z(t, "iterate", jt), ve(e) ? t : t.map(_e));
}
function mo(e) {
  return z(e = I(e), "iterate", jt), e;
}
const si = {
  __proto__: null,
  [Symbol.iterator]() {
    return Mn(this, Symbol.iterator, _e);
  },
  concat(...e) {
    return pt(this).concat(
      ...e.map((t) => C(t) ? pt(t) : t)
    );
  },
  entries() {
    return Mn(this, "entries", (e) => (e[1] = _e(e[1]), e));
  },
  every(e, t) {
    return Ue(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return Ue(this, "filter", e, t, (n) => n.map(_e), arguments);
  },
  find(e, t) {
    return Ue(this, "find", e, t, _e, arguments);
  },
  findIndex(e, t) {
    return Ue(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return Ue(this, "findLast", e, t, _e, arguments);
  },
  findLastIndex(e, t) {
    return Ue(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return Ue(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Fn(this, "includes", e);
  },
  indexOf(...e) {
    return Fn(this, "indexOf", e);
  },
  join(e) {
    return pt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimisation required
  lastIndexOf(...e) {
    return Fn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return Ue(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Vt(this, "pop");
  },
  push(...e) {
    return Vt(this, "push", e);
  },
  reduce(e, ...t) {
    return Ho(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ho(this, "reduceRight", e, t);
  },
  shift() {
    return Vt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return Ue(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Vt(this, "splice", e);
  },
  toReversed() {
    return pt(this).toReversed();
  },
  toSorted(e) {
    return pt(this).toSorted(e);
  },
  toSpliced(...e) {
    return pt(this).toSpliced(...e);
  },
  unshift(...e) {
    return Vt(this, "unshift", e);
  },
  values() {
    return Mn(this, "values", _e);
  }
};
function Mn(e, t, n) {
  const o = mo(e), s = o[t]();
  return o !== e && !ve(e) && (s._next = s.next, s.next = () => {
    const r = s._next();
    return r.value && (r.value = n(r.value)), r;
  }), s;
}
const ri = Array.prototype;
function Ue(e, t, n, o, s, r) {
  const i = mo(e), c = i !== e && !ve(e), u = i[t];
  if (u !== ri[t]) {
    const a = u.apply(e, r);
    return c ? _e(a) : a;
  }
  let p = n;
  i !== e && (c ? p = function(a, _) {
    return n.call(this, _e(a), _, e);
  } : n.length > 2 && (p = function(a, _) {
    return n.call(this, a, _, e);
  }));
  const d = u.call(i, p, o);
  return c && s ? s(d) : d;
}
function Ho(e, t, n, o) {
  const s = mo(e);
  let r = n;
  return s !== e && (ve(e) ? n.length > 3 && (r = function(i, c, u) {
    return n.call(this, i, c, u, e);
  }) : r = function(i, c, u) {
    return n.call(this, i, _e(c), u, e);
  }), s[t](r, ...o);
}
function Fn(e, t, n) {
  const o = I(e);
  z(o, "iterate", jt);
  const s = o[t](...n);
  return (s === -1 || s === !1) && un(n[0]) ? (n[0] = I(n[0]), o[t](...n)) : s;
}
function Vt(e, t, n = []) {
  De(), ho();
  const o = I(e)[t].apply(e, n);
  return _o(), Ve(), o;
}
const ii = /* @__PURE__ */ We("__proto__,__v_isRef,__isVue"), Is = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(tt)
);
function ci(e) {
  tt(e) || (e = String(e));
  const t = I(this);
  return z(t, "has", e), t.hasOwnProperty(e);
}
class Rs {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, o) {
    if (n === "__v_skip") return t.__v_skip;
    const s = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !s;
    if (n === "__v_isReadonly")
      return s;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return o === (s ? r ? Us : Ls : r ? Hs : js).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(o) ? t : void 0;
    const i = C(t);
    if (!s) {
      let u;
      if (i && (u = si[n]))
        return u;
      if (n === "hasOwnProperty")
        return ci;
    }
    const c = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      X(t) ? t : o
    );
    return (tt(n) ? Is.has(n) : ii(n)) || (s || z(t, "get", n), r) ? c : X(c) ? i && uo(n) ? c : c.value : K(c) ? s ? Bs(c) : vo(c) : c;
  }
}
class Ms extends Rs {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, o, s) {
    let r = t[n];
    if (!this._isShallow) {
      const u = Qe(r);
      if (!ve(o) && !Qe(o) && (r = I(r), o = I(o)), !C(t) && X(r) && !X(o))
        return u ? !1 : (r.value = o, !0);
    }
    const i = C(t) && uo(n) ? Number(n) < t.length : j(t, n), c = Reflect.set(
      t,
      n,
      o,
      X(t) ? t : s
    );
    return t === I(s) && (i ? ct(o, r) && Re(t, "set", n, o, r) : Re(t, "add", n, o)), c;
  }
  deleteProperty(t, n) {
    const o = j(t, n), s = t[n], r = Reflect.deleteProperty(t, n);
    return r && o && Re(t, "delete", n, void 0, s), r;
  }
  has(t, n) {
    const o = Reflect.has(t, n);
    return (!tt(n) || !Is.has(n)) && z(t, "has", n), o;
  }
  ownKeys(t) {
    return z(
      t,
      "iterate",
      C(t) ? "length" : lt
    ), Reflect.ownKeys(t);
  }
}
class Fs extends Rs {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return process.env.NODE_ENV !== "production" && je(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return process.env.NODE_ENV !== "production" && je(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const li = /* @__PURE__ */ new Ms(), fi = /* @__PURE__ */ new Fs(), ui = /* @__PURE__ */ new Ms(!0), ai = /* @__PURE__ */ new Fs(!0), zn = (e) => e, Yt = (e) => Reflect.getPrototypeOf(e);
function di(e, t, n) {
  return function(...o) {
    const s = this.__v_raw, r = I(s), i = it(r), c = e === "entries" || e === Symbol.iterator && i, u = e === "keys" && i, p = s[e](...o), d = n ? zn : t ? Yn : _e;
    return !t && z(
      r,
      "iterate",
      u ? Jn : lt
    ), {
      // iterator protocol
      next() {
        const { value: a, done: _ } = p.next();
        return _ ? { value: a, done: _ } : {
          value: c ? [d(a[0]), d(a[1])] : d(a),
          done: _
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Xt(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      je(
        `${On(e)} operation ${n}failed: target is readonly.`,
        I(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function pi(e, t) {
  const n = {
    get(s) {
      const r = this.__v_raw, i = I(r), c = I(s);
      e || (ct(s, c) && z(i, "get", s), z(i, "get", c));
      const { has: u } = Yt(i), p = t ? zn : e ? Yn : _e;
      if (u.call(i, s))
        return p(r.get(s));
      if (u.call(i, c))
        return p(r.get(c));
      r !== i && r.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && z(I(s), "iterate", lt), Reflect.get(s, "size", s);
    },
    has(s) {
      const r = this.__v_raw, i = I(r), c = I(s);
      return e || (ct(s, c) && z(i, "has", s), z(i, "has", c)), s === c ? r.has(s) : r.has(s) || r.has(c);
    },
    forEach(s, r) {
      const i = this, c = i.__v_raw, u = I(c), p = t ? zn : e ? Yn : _e;
      return !e && z(u, "iterate", lt), c.forEach((d, a) => s.call(r, p(d), p(a), i));
    }
  };
  return G(
    n,
    e ? {
      add: Xt("add"),
      set: Xt("set"),
      delete: Xt("delete"),
      clear: Xt("clear")
    } : {
      add(s) {
        !t && !ve(s) && !Qe(s) && (s = I(s));
        const r = I(this);
        return Yt(r).has.call(r, s) || (r.add(s), Re(r, "add", s, s)), this;
      },
      set(s, r) {
        !t && !ve(r) && !Qe(r) && (r = I(r));
        const i = I(this), { has: c, get: u } = Yt(i);
        let p = c.call(i, s);
        p ? process.env.NODE_ENV !== "production" && Lo(i, c, s) : (s = I(s), p = c.call(i, s));
        const d = u.call(i, s);
        return i.set(s, r), p ? ct(r, d) && Re(i, "set", s, r, d) : Re(i, "add", s, r), this;
      },
      delete(s) {
        const r = I(this), { has: i, get: c } = Yt(r);
        let u = i.call(r, s);
        u ? process.env.NODE_ENV !== "production" && Lo(r, i, s) : (s = I(s), u = i.call(r, s));
        const p = c ? c.call(r, s) : void 0, d = r.delete(s);
        return u && Re(r, "delete", s, void 0, p), d;
      },
      clear() {
        const s = I(this), r = s.size !== 0, i = process.env.NODE_ENV !== "production" ? it(s) ? new Map(s) : new Set(s) : void 0, c = s.clear();
        return r && Re(
          s,
          "clear",
          void 0,
          void 0,
          i
        ), c;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((s) => {
    n[s] = di(s, e, t);
  }), n;
}
function xn(e, t) {
  const n = pi(e, t);
  return (o, s, r) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? o : Reflect.get(
    j(n, s) && s in o ? n : o,
    s,
    r
  );
}
const hi = {
  get: /* @__PURE__ */ xn(!1, !1)
}, _i = {
  get: /* @__PURE__ */ xn(!1, !0)
}, gi = {
  get: /* @__PURE__ */ xn(!0, !1)
}, mi = {
  get: /* @__PURE__ */ xn(!0, !0)
};
function Lo(e, t, n) {
  const o = I(n);
  if (o !== n && t.call(e, o)) {
    const s = fo(e);
    je(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const js = /* @__PURE__ */ new WeakMap(), Hs = /* @__PURE__ */ new WeakMap(), Ls = /* @__PURE__ */ new WeakMap(), Us = /* @__PURE__ */ new WeakMap();
function vi(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Ei(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : vi(fo(e));
}
function vo(e) {
  return Qe(e) ? e : wn(
    e,
    !1,
    li,
    hi,
    js
  );
}
function bi(e) {
  return wn(
    e,
    !1,
    ui,
    _i,
    Hs
  );
}
function Bs(e) {
  return wn(
    e,
    !0,
    fi,
    gi,
    Ls
  );
}
function Me(e) {
  return wn(
    e,
    !0,
    ai,
    mi,
    Us
  );
}
function wn(e, t, n, o, s) {
  if (!K(e))
    return process.env.NODE_ENV !== "production" && je(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = Ei(e);
  if (r === 0)
    return e;
  const i = s.get(e);
  if (i)
    return i;
  const c = new Proxy(
    e,
    r === 2 ? o : n
  );
  return s.set(e, c), c;
}
function vt(e) {
  return Qe(e) ? vt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Qe(e) {
  return !!(e && e.__v_isReadonly);
}
function ve(e) {
  return !!(e && e.__v_isShallow);
}
function un(e) {
  return e ? !!e.__v_raw : !1;
}
function I(e) {
  const t = e && e.__v_raw;
  return t ? I(t) : e;
}
function Ni(e) {
  return !j(e, "__v_skip") && Object.isExtensible(e) && fn(e, "__v_skip", !0), e;
}
const _e = (e) => K(e) ? vo(e) : e, Yn = (e) => K(e) ? Bs(e) : e;
function X(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function Ws(e) {
  return X(e) ? e.value : e;
}
const yi = {
  get: (e, t, n) => t === "__v_raw" ? e : Ws(Reflect.get(e, t, n)),
  set: (e, t, n, o) => {
    const s = e[t];
    return X(s) && !X(n) ? (s.value = n, !0) : Reflect.set(e, t, n, o);
  }
};
function ks(e) {
  return vt(e) ? e : new Proxy(e, yi);
}
class Oi {
  constructor(t, n, o) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new Ps(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ft - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = o;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    H !== this)
      return Vs(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const t = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return Ts(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : process.env.NODE_ENV !== "production" && je("Write operation failed: computed value is readonly");
  }
}
function xi(e, t, n = !1) {
  let o, s;
  A(e) ? o = e : (o = e.get, s = e.set);
  const r = new Oi(o, s, n);
  return process.env.NODE_ENV, r;
}
const Zt = {}, an = /* @__PURE__ */ new WeakMap();
let rt;
function wi(e, t = !1, n = rt) {
  if (n) {
    let o = an.get(n);
    o || an.set(n, o = []), o.push(e);
  } else process.env.NODE_ENV !== "production" && !t && je(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Di(e, t, n = B) {
  const { immediate: o, deep: s, once: r, scheduler: i, augmentJob: c, call: u } = n, p = (T) => {
    (n.onWarn || je)(
      "Invalid watch source: ",
      T,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, d = (T) => s ? T : ve(T) || s === !1 || s === 0 ? Ye(T, 1) : Ye(T);
  let a, _, w, V, $ = !1, ee = !1;
  if (X(e) ? (_ = () => e.value, $ = ve(e)) : vt(e) ? (_ = () => d(e), $ = !0) : C(e) ? (ee = !0, $ = e.some((T) => vt(T) || ve(T)), _ = () => e.map((T) => {
    if (X(T))
      return T.value;
    if (vt(T))
      return d(T);
    if (A(T))
      return u ? u(T, 2) : T();
    process.env.NODE_ENV !== "production" && p(T);
  })) : A(e) ? t ? _ = u ? () => u(e, 2) : e : _ = () => {
    if (w) {
      De();
      try {
        w();
      } finally {
        Ve();
      }
    }
    const T = rt;
    rt = a;
    try {
      return u ? u(e, 3, [V]) : e(V);
    } finally {
      rt = T;
    }
  } : (_ = Y, process.env.NODE_ENV !== "production" && p(e)), t && s) {
    const T = _, Z = s === !0 ? 1 / 0 : s;
    _ = () => Ye(T(), Z);
  }
  const W = ti(), J = () => {
    a.stop(), W && W.active && co(W.effects, a);
  };
  if (r && t) {
    const T = t;
    t = (...Z) => {
      T(...Z), J();
    };
  }
  let L = ee ? new Array(e.length).fill(Zt) : Zt;
  const de = (T) => {
    if (!(!(a.flags & 1) || !a.dirty && !T))
      if (t) {
        const Z = a.run();
        if (s || $ || (ee ? Z.some((Ee, te) => ct(Ee, L[te])) : ct(Z, L))) {
          w && w();
          const Ee = rt;
          rt = a;
          try {
            const te = [
              Z,
              // pass undefined as the old value when it's changed for the first time
              L === Zt ? void 0 : ee && L[0] === Zt ? [] : L,
              V
            ];
            u ? u(t, 3, te) : (
              // @ts-expect-error
              t(...te)
            ), L = Z;
          } finally {
            rt = Ee;
          }
        }
      } else
        a.run();
  };
  return c && c(de), a = new ws(_), a.scheduler = i ? () => i(de, !1) : de, V = (T) => wi(T, !1, a), w = a.onStop = () => {
    const T = an.get(a);
    if (T) {
      if (u)
        u(T, 4);
      else
        for (const Z of T) Z();
      an.delete(a);
    }
  }, process.env.NODE_ENV !== "production" && (a.onTrack = n.onTrack, a.onTrigger = n.onTrigger), t ? o ? de(!0) : L = a.run() : i ? i(de.bind(null, !0), !0) : a.run(), J.pause = a.pause.bind(a), J.resume = a.resume.bind(a), J.stop = J, J;
}
function Ye(e, t = 1 / 0, n) {
  if (t <= 0 || !K(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Set(), n.has(e)))
    return e;
  if (n.add(e), t--, X(e))
    Ye(e.value, t, n);
  else if (C(e))
    for (let o = 0; o < e.length; o++)
      Ye(e[o], t, n);
  else if (bs(e) || it(e))
    e.forEach((o) => {
      Ye(o, t, n);
    });
  else if (Nn(e)) {
    for (const o in e)
      Ye(e[o], t, n);
    for (const o of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, o) && Ye(e[o], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.14
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const ft = [];
function Qt(e) {
  ft.push(e);
}
function en() {
  ft.pop();
}
let jn = !1;
function y(e, ...t) {
  if (jn) return;
  jn = !0, De();
  const n = ft.length ? ft[ft.length - 1].component : null, o = n && n.appContext.config.warnHandler, s = Vi();
  if (o)
    Nt(
      o,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((r) => {
          var i, c;
          return (c = (i = r.toString) == null ? void 0 : i.call(r)) != null ? c : JSON.stringify(r);
        }).join(""),
        n && n.proxy,
        s.map(
          ({ vnode: r }) => `at <${Tn(n, r.type)}>`
        ).join(`
`),
        s
      ]
    );
  else {
    const r = [`[Vue warn]: ${e}`, ...t];
    s.length && r.push(`
`, ...Si(s)), console.warn(...r);
  }
  Ve(), jn = !1;
}
function Vi() {
  let e = ft[ft.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const o = e.component && e.component.parent;
    e = o && o.vnode;
  }
  return t;
}
function Si(e) {
  const t = [];
  return e.forEach((n, o) => {
    t.push(...o === 0 ? [] : [`
`], ...Ci(n));
  }), t;
}
function Ci({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", o = e.component ? e.component.parent == null : !1, s = ` at <${Tn(
    e.component,
    e.type,
    o
  )}`, r = ">" + n;
  return e.props ? [s, ...Ti(e.props), r] : [s + r];
}
function Ti(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((o) => {
    t.push(...Ks(o, e[o]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Ks(e, t, n) {
  return q(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : X(t) ? (t = Ks(e, I(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : A(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = I(t), n ? t : [`${e}=`, t]);
}
const Eo = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function Nt(e, t, n, o) {
  try {
    return o ? e(...o) : e();
  } catch (s) {
    kt(s, t, n);
  }
}
function He(e, t, n, o) {
  if (A(e)) {
    const s = Nt(e, t, n, o);
    return s && lo(s) && s.catch((r) => {
      kt(r, t, n);
    }), s;
  }
  if (C(e)) {
    const s = [];
    for (let r = 0; r < e.length; r++)
      s.push(He(e[r], t, n, o));
    return s;
  } else process.env.NODE_ENV !== "production" && y(
    `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`
  );
}
function kt(e, t, n, o = !0) {
  const s = t ? t.vnode : null, { errorHandler: r, throwUnhandledErrorInProduction: i } = t && t.appContext.config || B;
  if (t) {
    let c = t.parent;
    const u = t.proxy, p = process.env.NODE_ENV !== "production" ? Eo[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; c; ) {
      const d = c.ec;
      if (d) {
        for (let a = 0; a < d.length; a++)
          if (d[a](e, u, p) === !1)
            return;
      }
      c = c.parent;
    }
    if (r) {
      De(), Nt(r, null, 10, [
        e,
        u,
        p
      ]), Ve();
      return;
    }
  }
  Ai(e, n, s, o, i);
}
function Ai(e, t, n, o = !0, s = !1) {
  if (process.env.NODE_ENV !== "production") {
    const r = Eo[t];
    if (n && Qt(n), y(`Unhandled error${r ? ` during execution of ${r}` : ""}`), n && en(), o)
      throw e;
    console.error(e);
  } else {
    if (s)
      throw e;
    console.error(e);
  }
}
const re = [];
let $e = -1;
const Et = [];
let Je = null, gt = 0;
const Gs = /* @__PURE__ */ Promise.resolve();
let dn = null;
const Pi = 100;
function qs(e) {
  const t = dn || Gs;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function $i(e) {
  let t = $e + 1, n = re.length;
  for (; t < n; ) {
    const o = t + n >>> 1, s = re[o], r = Ht(s);
    r < e || r === e && s.flags & 2 ? t = o + 1 : n = o;
  }
  return t;
}
function Dn(e) {
  if (!(e.flags & 1)) {
    const t = Ht(e), n = re[re.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Ht(n) ? re.push(e) : re.splice($i(t), 0, e), e.flags |= 1, Js();
  }
}
function Js() {
  dn || (dn = Gs.then(Xs));
}
function zs(e) {
  C(e) ? Et.push(...e) : Je && e.id === -1 ? Je.splice(gt + 1, 0, e) : e.flags & 1 || (Et.push(e), e.flags |= 1), Js();
}
function Uo(e, t, n = $e + 1) {
  for (process.env.NODE_ENV !== "production" && (t = t || /* @__PURE__ */ new Map()); n < re.length; n++) {
    const o = re[n];
    if (o && o.flags & 2) {
      if (e && o.id !== e.uid || process.env.NODE_ENV !== "production" && bo(t, o))
        continue;
      re.splice(n, 1), n--, o.flags & 4 && (o.flags &= -2), o(), o.flags & 4 || (o.flags &= -2);
    }
  }
}
function Ys(e) {
  if (Et.length) {
    const t = [...new Set(Et)].sort(
      (n, o) => Ht(n) - Ht(o)
    );
    if (Et.length = 0, Je) {
      Je.push(...t);
      return;
    }
    for (Je = t, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), gt = 0; gt < Je.length; gt++) {
      const n = Je[gt];
      process.env.NODE_ENV !== "production" && bo(e, n) || (n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2);
    }
    Je = null, gt = 0;
  }
}
const Ht = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Xs(e) {
  process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map());
  const t = process.env.NODE_ENV !== "production" ? (n) => bo(e, n) : Y;
  try {
    for ($e = 0; $e < re.length; $e++) {
      const n = re[$e];
      if (n && !(n.flags & 8)) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        n.flags & 4 && (n.flags &= -2), Nt(
          n,
          n.i,
          n.i ? 15 : 14
        ), n.flags & 4 || (n.flags &= -2);
      }
    }
  } finally {
    for (; $e < re.length; $e++) {
      const n = re[$e];
      n && (n.flags &= -2);
    }
    $e = -1, re.length = 0, Ys(e), dn = null, (re.length || Et.length) && Xs(e);
  }
}
function bo(e, t) {
  const n = e.get(t) || 0;
  if (n > Pi) {
    const o = t.i, s = o && Cr(o.type);
    return kt(
      `Maximum recursive updates exceeded${s ? ` in component <${s}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    ), !0;
  }
  return e.set(t, n + 1), !1;
}
let Fe = !1;
const tn = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (Wt().__VUE_HMR_RUNTIME__ = {
  createRecord: Hn(Zs),
  rerender: Hn(Mi),
  reload: Hn(Fi)
});
const at = /* @__PURE__ */ new Map();
function Ii(e) {
  const t = e.type.__hmrId;
  let n = at.get(t);
  n || (Zs(t, e.type), n = at.get(t)), n.instances.add(e);
}
function Ri(e) {
  at.get(e.type.__hmrId).instances.delete(e);
}
function Zs(e, t) {
  return at.has(e) ? !1 : (at.set(e, {
    initialDef: pn(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function pn(e) {
  return Tr(e) ? e.__vccOpts : e;
}
function Mi(e, t) {
  const n = at.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((o) => {
    t && (o.render = t, pn(o.type).render = t), o.renderCache = [], Fe = !0, o.update(), Fe = !1;
  }));
}
function Fi(e, t) {
  const n = at.get(e);
  if (!n) return;
  t = pn(t), Bo(n.initialDef, t);
  const o = [...n.instances];
  for (let s = 0; s < o.length; s++) {
    const r = o[s], i = pn(r.type);
    let c = tn.get(i);
    c || (i !== n.initialDef && Bo(i, t), tn.set(i, c = /* @__PURE__ */ new Set())), c.add(r), r.appContext.propsCache.delete(r.type), r.appContext.emitsCache.delete(r.type), r.appContext.optionsCache.delete(r.type), r.ceReload ? (c.add(r), r.ceReload(t.styles), c.delete(r)) : r.parent ? Dn(() => {
      Fe = !0, r.parent.update(), Fe = !1, c.delete(r);
    }) : r.appContext.reload ? r.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    ), r.root.ce && r !== r.root && r.root.ce._removeChildStyle(i);
  }
  zs(() => {
    tn.clear();
  });
}
function Bo(e, t) {
  G(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function Hn(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (o) {
      console.error(o), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let Oe, Tt = [], Xn = !1;
function Kt(e, ...t) {
  Oe ? Oe.emit(e, ...t) : Xn || Tt.push({ event: e, args: t });
}
function No(e, t) {
  var n, o;
  Oe = e, Oe ? (Oe.enabled = !0, Tt.forEach(({ event: s, args: r }) => Oe.emit(s, ...r)), Tt = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((o = (n = window.navigator) == null ? void 0 : n.userAgent) != null && o.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((r) => {
    No(r, t);
  }), setTimeout(() => {
    Oe || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, Xn = !0, Tt = []);
  }, 3e3)) : (Xn = !0, Tt = []);
}
function ji(e, t) {
  Kt("app:init", e, t, {
    Fragment: Ie,
    Text: Gt,
    Comment: we,
    Static: sn
  });
}
function Hi(e) {
  Kt("app:unmount", e);
}
const Li = /* @__PURE__ */ yo(
  "component:added"
  /* COMPONENT_ADDED */
), Qs = /* @__PURE__ */ yo(
  "component:updated"
  /* COMPONENT_UPDATED */
), Ui = /* @__PURE__ */ yo(
  "component:removed"
  /* COMPONENT_REMOVED */
), Bi = (e) => {
  Oe && typeof Oe.cleanupBuffer == "function" && // remove the component if it wasn't buffered
  !Oe.cleanupBuffer(e) && Ui(e);
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function yo(e) {
  return (t) => {
    Kt(
      e,
      t.appContext.app,
      t.uid,
      t.parent ? t.parent.uid : void 0,
      t
    );
  };
}
const Wi = /* @__PURE__ */ er(
  "perf:start"
  /* PERFORMANCE_START */
), ki = /* @__PURE__ */ er(
  "perf:end"
  /* PERFORMANCE_END */
);
function er(e) {
  return (t, n, o) => {
    Kt(e, t.appContext.app, t.uid, t, n, o);
  };
}
function Ki(e, t, n) {
  Kt(
    "component:emit",
    e.appContext.app,
    e,
    t,
    n
  );
}
let ue = null, tr = null;
function hn(e) {
  const t = ue;
  return ue = e, tr = e && e.type.__scopeId || null, t;
}
function Gi(e, t = ue, n) {
  if (!t || e._n)
    return e;
  const o = (...s) => {
    o._d && es(-1);
    const r = hn(t);
    let i;
    try {
      i = e(...s);
    } finally {
      hn(r), o._d && es(1);
    }
    return process.env.NODE_ENV !== "production" && Qs(t), i;
  };
  return o._n = !0, o._c = !0, o._d = !0, o;
}
function nr(e) {
  jr(e) && y("Do not use built-in directive ids as custom directive id: " + e);
}
function nt(e, t, n, o) {
  const s = e.dirs, r = t && t.dirs;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    r && (c.oldValue = r[i].value);
    let u = c.dir[o];
    u && (De(), He(u, n, 8, [
      e.el,
      c,
      e,
      t
    ]), Ve());
  }
}
const qi = Symbol("_vte"), Ji = (e) => e.__isTeleport;
function Oo(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, Oo(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function zi(e, t) {
  return A(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    G({ name: e.name }, t, { setup: e })
  ) : e;
}
function or(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const Yi = /* @__PURE__ */ new WeakSet();
function _n(e, t, n, o, s = !1) {
  if (C(e)) {
    e.forEach(
      (V, $) => _n(
        V,
        t && (C(t) ? t[$] : t),
        n,
        o,
        s
      )
    );
    return;
  }
  if (Rt(o) && !s) {
    o.shapeFlag & 512 && o.type.__asyncResolved && o.component.subTree.component && _n(e, t, n, o.component.subTree);
    return;
  }
  const r = o.shapeFlag & 4 ? To(o.component) : o.el, i = s ? null : r, { i: c, r: u } = e;
  if (process.env.NODE_ENV !== "production" && !c) {
    y(
      "Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function."
    );
    return;
  }
  const p = t && t.r, d = c.refs === B ? c.refs = {} : c.refs, a = c.setupState, _ = I(a), w = a === B ? () => !1 : (V) => process.env.NODE_ENV !== "production" && (j(_, V) && !X(_[V]) && y(
    `Template ref "${V}" used on a non-ref value. It will not work in the production build.`
  ), Yi.has(_[V])) ? !1 : j(_, V);
  if (p != null && p !== u && (q(p) ? (d[p] = null, w(p) && (a[p] = null)) : X(p) && (p.value = null)), A(u))
    Nt(u, c, 12, [i, d]);
  else {
    const V = q(u), $ = X(u);
    if (V || $) {
      const ee = () => {
        if (e.f) {
          const W = V ? w(u) ? a[u] : d[u] : u.value;
          s ? C(W) && co(W, r) : C(W) ? W.includes(r) || W.push(r) : V ? (d[u] = [r], w(u) && (a[u] = d[u])) : (u.value = [r], e.k && (d[e.k] = u.value));
        } else V ? (d[u] = i, w(u) && (a[u] = i)) : $ ? (u.value = i, e.k && (d[e.k] = i)) : process.env.NODE_ENV !== "production" && y("Invalid template ref type:", u, `(${typeof u})`);
      };
      i ? (ee.id = -1, he(ee, n)) : ee();
    } else process.env.NODE_ENV !== "production" && y("Invalid template ref type:", u, `(${typeof u})`);
  }
}
Wt().requestIdleCallback;
Wt().cancelIdleCallback;
const Rt = (e) => !!e.type.__asyncLoader, xo = (e) => e.type.__isKeepAlive;
function Xi(e, t) {
  sr(e, "a", t);
}
function Zi(e, t) {
  sr(e, "da", t);
}
function sr(e, t, n = Q) {
  const o = e.__wdc || (e.__wdc = () => {
    let s = n;
    for (; s; ) {
      if (s.isDeactivated)
        return;
      s = s.parent;
    }
    return e();
  });
  if (Vn(t, o, n), n) {
    let s = n.parent;
    for (; s && s.parent; )
      xo(s.parent.vnode) && Qi(o, t, n, s), s = s.parent;
  }
}
function Qi(e, t, n, o) {
  const s = Vn(
    t,
    e,
    o,
    !0
    /* prepend */
  );
  rr(() => {
    co(o[t], s);
  }, n);
}
function Vn(e, t, n = Q, o = !1) {
  if (n) {
    const s = n[e] || (n[e] = []), r = t.__weh || (t.__weh = (...i) => {
      De();
      const c = qt(n), u = He(t, n, e, i);
      return c(), Ve(), u;
    });
    return o ? s.unshift(r) : s.push(r), r;
  } else if (process.env.NODE_ENV !== "production") {
    const s = st(Eo[e].replace(/ hook$/, ""));
    y(
      `${s} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const ke = (e) => (t, n = Q) => {
  (!Ut || e === "sp") && Vn(e, (...o) => t(...o), n);
}, ec = ke("bm"), tc = ke("m"), nc = ke(
  "bu"
), oc = ke("u"), sc = ke(
  "bum"
), rr = ke("um"), rc = ke(
  "sp"
), ic = ke("rtg"), cc = ke("rtc");
function lc(e, t = Q) {
  Vn("ec", e, t);
}
const fc = Symbol.for("v-ndc"), Zn = (e) => e ? Vr(e) ? To(e) : Zn(e.parent) : null, ut = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ G(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => process.env.NODE_ENV !== "production" ? Me(e.props) : e.props,
    $attrs: (e) => process.env.NODE_ENV !== "production" ? Me(e.attrs) : e.attrs,
    $slots: (e) => process.env.NODE_ENV !== "production" ? Me(e.slots) : e.slots,
    $refs: (e) => process.env.NODE_ENV !== "production" ? Me(e.refs) : e.refs,
    $parent: (e) => Zn(e.parent),
    $root: (e) => Zn(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => lr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Dn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = qs.bind(e.proxy)),
    $watch: (e) => Bc.bind(e)
  })
), wo = (e) => e === "_" || e === "$", Ln = (e, t) => e !== B && !e.__isScriptSetup && j(e, t), ir = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: o, data: s, props: r, accessCache: i, type: c, appContext: u } = e;
    if (process.env.NODE_ENV !== "production" && t === "__isVue")
      return !0;
    let p;
    if (t[0] !== "$") {
      const w = i[t];
      if (w !== void 0)
        switch (w) {
          case 1:
            return o[t];
          case 2:
            return s[t];
          case 4:
            return n[t];
          case 3:
            return r[t];
        }
      else {
        if (Ln(o, t))
          return i[t] = 1, o[t];
        if (s !== B && j(s, t))
          return i[t] = 2, s[t];
        if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (p = e.propsOptions[0]) && j(p, t)
        )
          return i[t] = 3, r[t];
        if (n !== B && j(n, t))
          return i[t] = 4, n[t];
        Qn && (i[t] = 0);
      }
    }
    const d = ut[t];
    let a, _;
    if (d)
      return t === "$attrs" ? (z(e.attrs, "get", ""), process.env.NODE_ENV !== "production" && vn()) : process.env.NODE_ENV !== "production" && t === "$slots" && z(e, "get", t), d(e);
    if (
      // css module (injected by vue-loader)
      (a = c.__cssModules) && (a = a[t])
    )
      return a;
    if (n !== B && j(n, t))
      return i[t] = 4, n[t];
    if (
      // global properties
      _ = u.config.globalProperties, j(_, t)
    )
      return _[t];
    process.env.NODE_ENV !== "production" && ue && (!q(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    t.indexOf("__v") !== 0) && (s !== B && wo(t[0]) && j(s, t) ? y(
      `Property ${JSON.stringify(
        t
      )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
    ) : e === ue && y(
      `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
    ));
  },
  set({ _: e }, t, n) {
    const { data: o, setupState: s, ctx: r } = e;
    return Ln(s, t) ? (s[t] = n, !0) : process.env.NODE_ENV !== "production" && s.__isScriptSetup && j(s, t) ? (y(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1) : o !== B && j(o, t) ? (o[t] = n, !0) : j(e.props, t) ? (process.env.NODE_ENV !== "production" && y(`Attempting to mutate prop "${t}". Props are readonly.`), !1) : t[0] === "$" && t.slice(1) in e ? (process.env.NODE_ENV !== "production" && y(
      `Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`
    ), !1) : (process.env.NODE_ENV !== "production" && t in e.appContext.config.globalProperties ? Object.defineProperty(r, t, {
      enumerable: !0,
      configurable: !0,
      value: n
    }) : r[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: o, appContext: s, propsOptions: r }
  }, i) {
    let c;
    return !!n[i] || e !== B && j(e, i) || Ln(t, i) || (c = r[0]) && j(c, i) || j(o, i) || j(ut, i) || j(s.config.globalProperties, i);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : j(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
process.env.NODE_ENV !== "production" && (ir.ownKeys = (e) => (y(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
function uc(e) {
  const t = {};
  return Object.defineProperty(t, "_", {
    configurable: !0,
    enumerable: !1,
    get: () => e
  }), Object.keys(ut).forEach((n) => {
    Object.defineProperty(t, n, {
      configurable: !0,
      enumerable: !1,
      get: () => ut[n](e),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: Y
    });
  }), t;
}
function ac(e) {
  const {
    ctx: t,
    propsOptions: [n]
  } = e;
  n && Object.keys(n).forEach((o) => {
    Object.defineProperty(t, o, {
      enumerable: !0,
      configurable: !0,
      get: () => e.props[o],
      set: Y
    });
  });
}
function dc(e) {
  const { ctx: t, setupState: n } = e;
  Object.keys(I(n)).forEach((o) => {
    if (!n.__isScriptSetup) {
      if (wo(o[0])) {
        y(
          `setup() return property ${JSON.stringify(
            o
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(t, o, {
        enumerable: !0,
        configurable: !0,
        get: () => n[o],
        set: Y
      });
    }
  });
}
function Wo(e) {
  return C(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function pc() {
  const e = /* @__PURE__ */ Object.create(null);
  return (t, n) => {
    e[n] ? y(`${t} property "${n}" is already defined in ${e[n]}.`) : e[n] = t;
  };
}
let Qn = !0;
function hc(e) {
  const t = lr(e), n = e.proxy, o = e.ctx;
  Qn = !1, t.beforeCreate && ko(t.beforeCreate, e, "bc");
  const {
    // state
    data: s,
    computed: r,
    methods: i,
    watch: c,
    provide: u,
    inject: p,
    // lifecycle
    created: d,
    beforeMount: a,
    mounted: _,
    beforeUpdate: w,
    updated: V,
    activated: $,
    deactivated: ee,
    beforeDestroy: W,
    beforeUnmount: J,
    destroyed: L,
    unmounted: de,
    render: T,
    renderTracked: Z,
    renderTriggered: Ee,
    errorCaptured: te,
    serverPrefetch: ie,
    // public API
    expose: Le,
    inheritAttrs: Ke,
    // assets
    components: Ne,
    directives: Jt,
    filters: Po
  } = t, Ge = process.env.NODE_ENV !== "production" ? pc() : null;
  if (process.env.NODE_ENV !== "production") {
    const [M] = e.propsOptions;
    if (M)
      for (const R in M)
        Ge("Props", R);
  }
  if (p && _c(p, o, Ge), i)
    for (const M in i) {
      const R = i[M];
      A(R) ? (process.env.NODE_ENV !== "production" ? Object.defineProperty(o, M, {
        value: R.bind(n),
        configurable: !0,
        enumerable: !0,
        writable: !0
      }) : o[M] = R.bind(n), process.env.NODE_ENV !== "production" && Ge("Methods", M)) : process.env.NODE_ENV !== "production" && y(
        `Method "${M}" has type "${typeof R}" in the component definition. Did you reference the function correctly?`
      );
    }
  if (s) {
    process.env.NODE_ENV !== "production" && !A(s) && y(
      "The data option must be a function. Plain object usage is no longer supported."
    );
    const M = s.call(n, n);
    if (process.env.NODE_ENV !== "production" && lo(M) && y(
      "data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."
    ), !K(M))
      process.env.NODE_ENV !== "production" && y("data() should return an object.");
    else if (e.data = vo(M), process.env.NODE_ENV !== "production")
      for (const R in M)
        Ge("Data", R), wo(R[0]) || Object.defineProperty(o, R, {
          configurable: !0,
          enumerable: !0,
          get: () => M[R],
          set: Y
        });
  }
  if (Qn = !0, r)
    for (const M in r) {
      const R = r[M], Se = A(R) ? R.bind(n, n) : A(R.get) ? R.get.bind(n, n) : Y;
      process.env.NODE_ENV !== "production" && Se === Y && y(`Computed property "${M}" has no getter.`);
      const An = !A(R) && A(R.set) ? R.set.bind(n) : process.env.NODE_ENV !== "production" ? () => {
        y(
          `Write operation failed: computed property "${M}" is readonly.`
        );
      } : Y, yt = gl({
        get: Se,
        set: An
      });
      Object.defineProperty(o, M, {
        enumerable: !0,
        configurable: !0,
        get: () => yt.value,
        set: (dt) => yt.value = dt
      }), process.env.NODE_ENV !== "production" && Ge("Computed", M);
    }
  if (c)
    for (const M in c)
      cr(c[M], o, n, M);
  if (u) {
    const M = A(u) ? u.call(n) : u;
    Reflect.ownKeys(M).forEach((R) => {
      Nc(R, M[R]);
    });
  }
  d && ko(d, e, "c");
  function ce(M, R) {
    C(R) ? R.forEach((Se) => M(Se.bind(n))) : R && M(R.bind(n));
  }
  if (ce(ec, a), ce(tc, _), ce(nc, w), ce(oc, V), ce(Xi, $), ce(Zi, ee), ce(lc, te), ce(cc, Z), ce(ic, Ee), ce(sc, J), ce(rr, de), ce(rc, ie), C(Le))
    if (Le.length) {
      const M = e.exposed || (e.exposed = {});
      Le.forEach((R) => {
        Object.defineProperty(M, R, {
          get: () => n[R],
          set: (Se) => n[R] = Se
        });
      });
    } else e.exposed || (e.exposed = {});
  T && e.render === Y && (e.render = T), Ke != null && (e.inheritAttrs = Ke), Ne && (e.components = Ne), Jt && (e.directives = Jt), ie && or(e);
}
function _c(e, t, n = Y) {
  C(e) && (e = eo(e));
  for (const o in e) {
    const s = e[o];
    let r;
    K(s) ? "default" in s ? r = nn(
      s.from || o,
      s.default,
      !0
    ) : r = nn(s.from || o) : r = nn(s), X(r) ? Object.defineProperty(t, o, {
      enumerable: !0,
      configurable: !0,
      get: () => r.value,
      set: (i) => r.value = i
    }) : t[o] = r, process.env.NODE_ENV !== "production" && n("Inject", o);
  }
}
function ko(e, t, n) {
  He(
    C(e) ? e.map((o) => o.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function cr(e, t, n, o) {
  let s = o.includes(".") ? br(n, o) : () => n[o];
  if (q(e)) {
    const r = t[e];
    A(r) ? Bn(s, r) : process.env.NODE_ENV !== "production" && y(`Invalid watch handler specified by key "${e}"`, r);
  } else if (A(e))
    Bn(s, e.bind(n));
  else if (K(e))
    if (C(e))
      e.forEach((r) => cr(r, t, n, o));
    else {
      const r = A(e.handler) ? e.handler.bind(n) : t[e.handler];
      A(r) ? Bn(s, r, e) : process.env.NODE_ENV !== "production" && y(`Invalid watch handler specified by key "${e.handler}"`, r);
    }
  else process.env.NODE_ENV !== "production" && y(`Invalid watch option: "${o}"`, e);
}
function lr(e) {
  const t = e.type, { mixins: n, extends: o } = t, {
    mixins: s,
    optionsCache: r,
    config: { optionMergeStrategies: i }
  } = e.appContext, c = r.get(t);
  let u;
  return c ? u = c : !s.length && !n && !o ? u = t : (u = {}, s.length && s.forEach(
    (p) => gn(u, p, i, !0)
  ), gn(u, t, i)), K(t) && r.set(t, u), u;
}
function gn(e, t, n, o = !1) {
  const { mixins: s, extends: r } = t;
  r && gn(e, r, n, !0), s && s.forEach(
    (i) => gn(e, i, n, !0)
  );
  for (const i in t)
    if (o && i === "expose")
      process.env.NODE_ENV !== "production" && y(
        '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
      );
    else {
      const c = gc[i] || n && n[i];
      e[i] = c ? c(e[i], t[i]) : t[i];
    }
  return e;
}
const gc = {
  data: Ko,
  props: Go,
  emits: Go,
  // objects
  methods: At,
  computed: At,
  // lifecycle
  beforeCreate: oe,
  created: oe,
  beforeMount: oe,
  mounted: oe,
  beforeUpdate: oe,
  updated: oe,
  beforeDestroy: oe,
  beforeUnmount: oe,
  destroyed: oe,
  unmounted: oe,
  activated: oe,
  deactivated: oe,
  errorCaptured: oe,
  serverPrefetch: oe,
  // assets
  components: At,
  directives: At,
  // watch
  watch: vc,
  // provide / inject
  provide: Ko,
  inject: mc
};
function Ko(e, t) {
  return t ? e ? function() {
    return G(
      A(e) ? e.call(this, this) : e,
      A(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function mc(e, t) {
  return At(eo(e), eo(t));
}
function eo(e) {
  if (C(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function oe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function At(e, t) {
  return e ? G(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Go(e, t) {
  return e ? C(e) && C(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : G(
    /* @__PURE__ */ Object.create(null),
    Wo(e),
    Wo(t ?? {})
  ) : t;
}
function vc(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = G(/* @__PURE__ */ Object.create(null), e);
  for (const o in t)
    n[o] = oe(e[o], t[o]);
  return n;
}
function fr() {
  return {
    app: null,
    config: {
      isNativeTag: Mr,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Ec = 0;
function bc(e, t) {
  return function(o, s = null) {
    A(o) || (o = G({}, o)), s != null && !K(s) && (process.env.NODE_ENV !== "production" && y("root props passed to app.mount() must be an object."), s = null);
    const r = fr(), i = /* @__PURE__ */ new WeakSet(), c = [];
    let u = !1;
    const p = r.app = {
      _uid: Ec++,
      _component: o,
      _props: s,
      _container: null,
      _context: r,
      _instance: null,
      version: ss,
      get config() {
        return r.config;
      },
      set config(d) {
        process.env.NODE_ENV !== "production" && y(
          "app.config cannot be replaced. Modify individual options instead."
        );
      },
      use(d, ...a) {
        return i.has(d) ? process.env.NODE_ENV !== "production" && y("Plugin has already been applied to target app.") : d && A(d.install) ? (i.add(d), d.install(p, ...a)) : A(d) ? (i.add(d), d(p, ...a)) : process.env.NODE_ENV !== "production" && y(
          'A plugin must either be a function or an object with an "install" function.'
        ), p;
      },
      mixin(d) {
        return r.mixins.includes(d) ? process.env.NODE_ENV !== "production" && y(
          "Mixin has already been applied to target app" + (d.name ? `: ${d.name}` : "")
        ) : r.mixins.push(d), p;
      },
      component(d, a) {
        return process.env.NODE_ENV !== "production" && ro(d, r.config), a ? (process.env.NODE_ENV !== "production" && r.components[d] && y(`Component "${d}" has already been registered in target app.`), r.components[d] = a, p) : r.components[d];
      },
      directive(d, a) {
        return process.env.NODE_ENV !== "production" && nr(d), a ? (process.env.NODE_ENV !== "production" && r.directives[d] && y(`Directive "${d}" has already been registered in target app.`), r.directives[d] = a, p) : r.directives[d];
      },
      mount(d, a, _) {
        if (u)
          process.env.NODE_ENV !== "production" && y(
            "App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`"
          );
        else {
          process.env.NODE_ENV !== "production" && d.__vue_app__ && y(
            "There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first."
          );
          const w = p._ceVNode || Ze(o, s);
          return w.appContext = r, _ === !0 ? _ = "svg" : _ === !1 && (_ = void 0), process.env.NODE_ENV !== "production" && (r.reload = () => {
            const V = et(w);
            V.el = null, e(V, d, _);
          }), e(w, d, _), u = !0, p._container = d, d.__vue_app__ = p, process.env.NODE_ENV !== "production" && (p._instance = w.component, ji(p, ss)), To(w.component);
        }
      },
      onUnmount(d) {
        process.env.NODE_ENV !== "production" && typeof d != "function" && y(
          `Expected function as first argument to app.onUnmount(), but got ${typeof d}`
        ), c.push(d);
      },
      unmount() {
        u ? (He(
          c,
          p._instance,
          16
        ), e(null, p._container), process.env.NODE_ENV !== "production" && (p._instance = null, Hi(p)), delete p._container.__vue_app__) : process.env.NODE_ENV !== "production" && y("Cannot unmount an app that is not mounted.");
      },
      provide(d, a) {
        return process.env.NODE_ENV !== "production" && d in r.provides && y(
          `App already provides property with key "${String(d)}". It will be overwritten with the new value.`
        ), r.provides[d] = a, p;
      },
      runWithContext(d) {
        const a = bt;
        bt = p;
        try {
          return d();
        } finally {
          bt = a;
        }
      }
    };
    return p;
  };
}
let bt = null;
function Nc(e, t) {
  if (!Q)
    process.env.NODE_ENV !== "production" && y("provide() can only be used inside setup().");
  else {
    let n = Q.provides;
    const o = Q.parent && Q.parent.provides;
    o === n && (n = Q.provides = Object.create(o)), n[e] = t;
  }
}
function nn(e, t, n = !1) {
  const o = Q || ue;
  if (o || bt) {
    const s = bt ? bt._context.provides : o ? o.parent == null ? o.vnode.appContext && o.vnode.appContext.provides : o.parent.provides : void 0;
    if (s && e in s)
      return s[e];
    if (arguments.length > 1)
      return n && A(t) ? t.call(o && o.proxy) : t;
    process.env.NODE_ENV !== "production" && y(`injection "${String(e)}" not found.`);
  } else process.env.NODE_ENV !== "production" && y("inject() can only be used inside setup() or functional components.");
}
const ur = {}, ar = () => Object.create(ur), dr = (e) => Object.getPrototypeOf(e) === ur;
function yc(e, t, n, o = !1) {
  const s = {}, r = ar();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), pr(e, t, s, r);
  for (const i in e.propsOptions[0])
    i in s || (s[i] = void 0);
  process.env.NODE_ENV !== "production" && _r(t || {}, s, e), n ? e.props = o ? s : bi(s) : e.type.props ? e.props = s : e.props = r, e.attrs = r;
}
function Oc(e) {
  for (; e; ) {
    if (e.type.__hmrId) return !0;
    e = e.parent;
  }
}
function xc(e, t, n, o) {
  const {
    props: s,
    attrs: r,
    vnode: { patchFlag: i }
  } = e, c = I(s), [u] = e.propsOptions;
  let p = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(process.env.NODE_ENV !== "production" && Oc(e)) && (o || i > 0) && !(i & 16)
  ) {
    if (i & 8) {
      const d = e.vnode.dynamicProps;
      for (let a = 0; a < d.length; a++) {
        let _ = d[a];
        if (Sn(e.emitsOptions, _))
          continue;
        const w = t[_];
        if (u)
          if (j(r, _))
            w !== r[_] && (r[_] = w, p = !0);
          else {
            const V = ae(_);
            s[V] = to(
              u,
              c,
              V,
              w,
              e,
              !1
            );
          }
        else
          w !== r[_] && (r[_] = w, p = !0);
      }
    }
  } else {
    pr(e, t, s, r) && (p = !0);
    let d;
    for (const a in c)
      (!t || // for camelCase
      !j(t, a) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = ge(a)) === a || !j(t, d))) && (u ? n && // for camelCase
      (n[a] !== void 0 || // for kebab-case
      n[d] !== void 0) && (s[a] = to(
        u,
        c,
        a,
        void 0,
        e,
        !0
      )) : delete s[a]);
    if (r !== c)
      for (const a in r)
        (!t || !j(t, a)) && (delete r[a], p = !0);
  }
  p && Re(e.attrs, "set", ""), process.env.NODE_ENV !== "production" && _r(t || {}, s, e);
}
function pr(e, t, n, o) {
  const [s, r] = e.propsOptions;
  let i = !1, c;
  if (t)
    for (let u in t) {
      if (Pt(u))
        continue;
      const p = t[u];
      let d;
      s && j(s, d = ae(u)) ? !r || !r.includes(d) ? n[d] = p : (c || (c = {}))[d] = p : Sn(e.emitsOptions, u) || (!(u in o) || p !== o[u]) && (o[u] = p, i = !0);
    }
  if (r) {
    const u = I(n), p = c || B;
    for (let d = 0; d < r.length; d++) {
      const a = r[d];
      n[a] = to(
        s,
        u,
        a,
        p[a],
        e,
        !j(p, a)
      );
    }
  }
  return i;
}
function to(e, t, n, o, s, r) {
  const i = e[n];
  if (i != null) {
    const c = j(i, "default");
    if (c && o === void 0) {
      const u = i.default;
      if (i.type !== Function && !i.skipFactory && A(u)) {
        const { propsDefaults: p } = s;
        if (n in p)
          o = p[n];
        else {
          const d = qt(s);
          o = p[n] = u.call(
            null,
            t
          ), d();
        }
      } else
        o = u;
      s.ce && s.ce._setProp(n, o);
    }
    i[
      0
      /* shouldCast */
    ] && (r && !c ? o = !1 : i[
      1
      /* shouldCastTrue */
    ] && (o === "" || o === ge(n)) && (o = !0));
  }
  return o;
}
const wc = /* @__PURE__ */ new WeakMap();
function hr(e, t, n = !1) {
  const o = n ? wc : t.propsCache, s = o.get(e);
  if (s)
    return s;
  const r = e.props, i = {}, c = [];
  let u = !1;
  if (!A(e)) {
    const d = (a) => {
      u = !0;
      const [_, w] = hr(a, t, !0);
      G(i, _), w && c.push(...w);
    };
    !n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  if (!r && !u)
    return K(e) && o.set(e, mt), mt;
  if (C(r))
    for (let d = 0; d < r.length; d++) {
      process.env.NODE_ENV !== "production" && !q(r[d]) && y("props must be strings when using array syntax.", r[d]);
      const a = ae(r[d]);
      qo(a) && (i[a] = B);
    }
  else if (r) {
    process.env.NODE_ENV !== "production" && !K(r) && y("invalid props options", r);
    for (const d in r) {
      const a = ae(d);
      if (qo(a)) {
        const _ = r[d], w = i[a] = C(_) || A(_) ? { type: _ } : G({}, _), V = w.type;
        let $ = !1, ee = !0;
        if (C(V))
          for (let W = 0; W < V.length; ++W) {
            const J = V[W], L = A(J) && J.name;
            if (L === "Boolean") {
              $ = !0;
              break;
            } else L === "String" && (ee = !1);
          }
        else
          $ = A(V) && V.name === "Boolean";
        w[
          0
          /* shouldCast */
        ] = $, w[
          1
          /* shouldCastTrue */
        ] = ee, ($ || j(w, "default")) && c.push(a);
      }
    }
  }
  const p = [i, c];
  return K(e) && o.set(e, p), p;
}
function qo(e) {
  return e[0] !== "$" && !Pt(e) ? !0 : (process.env.NODE_ENV !== "production" && y(`Invalid prop name: "${e}" is a reserved property.`), !1);
}
function Dc(e) {
  return e === null ? "null" : typeof e == "function" ? e.name || "" : typeof e == "object" && e.constructor && e.constructor.name || "";
}
function _r(e, t, n) {
  const o = I(t), s = n.propsOptions[0], r = Object.keys(e).map((i) => ae(i));
  for (const i in s) {
    let c = s[i];
    c != null && Vc(
      i,
      o[i],
      c,
      process.env.NODE_ENV !== "production" ? Me(o) : o,
      !r.includes(i)
    );
  }
}
function Vc(e, t, n, o, s) {
  const { type: r, required: i, validator: c, skipCheck: u } = n;
  if (i && s) {
    y('Missing required prop: "' + e + '"');
    return;
  }
  if (!(t == null && !i)) {
    if (r != null && r !== !0 && !u) {
      let p = !1;
      const d = C(r) ? r : [r], a = [];
      for (let _ = 0; _ < d.length && !p; _++) {
        const { valid: w, expectedType: V } = Cc(t, d[_]);
        a.push(V || ""), p = w;
      }
      if (!p) {
        y(Tc(e, t, a));
        return;
      }
    }
    c && !c(t, o) && y('Invalid prop: custom validator check failed for prop "' + e + '".');
  }
}
const Sc = /* @__PURE__ */ We(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function Cc(e, t) {
  let n;
  const o = Dc(t);
  if (o === "null")
    n = e === null;
  else if (Sc(o)) {
    const s = typeof e;
    n = s === o.toLowerCase(), !n && s === "object" && (n = e instanceof t);
  } else o === "Object" ? n = K(e) : o === "Array" ? n = C(e) : n = e instanceof t;
  return {
    valid: n,
    expectedType: o
  };
}
function Tc(e, t, n) {
  if (n.length === 0)
    return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
  let o = `Invalid prop: type check failed for prop "${e}". Expected ${n.map(On).join(" | ")}`;
  const s = n[0], r = fo(t), i = Jo(t, s), c = Jo(t, r);
  return n.length === 1 && zo(s) && !Ac(s, r) && (o += ` with value ${i}`), o += `, got ${r} `, zo(r) && (o += `with value ${c}.`), o;
}
function Jo(e, t) {
  return t === "String" ? `"${e}"` : t === "Number" ? `${Number(e)}` : `${e}`;
}
function zo(e) {
  return ["string", "number", "boolean"].some((n) => e.toLowerCase() === n);
}
function Ac(...e) {
  return e.some((t) => t.toLowerCase() === "boolean");
}
const Do = (e) => e[0] === "_" || e === "$stable", Vo = (e) => C(e) ? e.map(ye) : [ye(e)], Pc = (e, t, n) => {
  if (t._n)
    return t;
  const o = Gi((...s) => (process.env.NODE_ENV !== "production" && Q && !(n === null && ue) && !(n && n.root !== Q.root) && y(
    `Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
  ), Vo(t(...s))), n);
  return o._c = !1, o;
}, gr = (e, t, n) => {
  const o = e._ctx;
  for (const s in e) {
    if (Do(s)) continue;
    const r = e[s];
    if (A(r))
      t[s] = Pc(s, r, o);
    else if (r != null) {
      process.env.NODE_ENV !== "production" && y(
        `Non-function value encountered for slot "${s}". Prefer function slots for better performance.`
      );
      const i = Vo(r);
      t[s] = () => i;
    }
  }
}, mr = (e, t) => {
  process.env.NODE_ENV !== "production" && !xo(e.vnode) && y(
    "Non-function value encountered for default slot. Prefer function slots for better performance."
  );
  const n = Vo(t);
  e.slots.default = () => n;
}, no = (e, t, n) => {
  for (const o in t)
    (n || !Do(o)) && (e[o] = t[o]);
}, $c = (e, t, n) => {
  const o = e.slots = ar();
  if (e.vnode.shapeFlag & 32) {
    const s = t._;
    s ? (no(o, t, n), n && fn(o, "_", s, !0)) : gr(t, o);
  } else t && mr(e, t);
}, Ic = (e, t, n) => {
  const { vnode: o, slots: s } = e;
  let r = !0, i = B;
  if (o.shapeFlag & 32) {
    const c = t._;
    c ? process.env.NODE_ENV !== "production" && Fe ? (no(s, t, n), Re(e, "set", "$slots")) : n && c === 1 ? r = !1 : no(s, t, n) : (r = !t.$stable, gr(t, s)), i = t;
  } else t && (mr(e, t), i = { default: 1 });
  if (r)
    for (const c in s)
      !Do(c) && i[c] == null && delete s[c];
};
let St, Xe;
function ht(e, t) {
  e.appContext.config.performance && mn() && Xe.mark(`vue-${t}-${e.uid}`), process.env.NODE_ENV !== "production" && Wi(e, t, mn() ? Xe.now() : Date.now());
}
function _t(e, t) {
  if (e.appContext.config.performance && mn()) {
    const n = `vue-${t}-${e.uid}`, o = n + ":end";
    Xe.mark(o), Xe.measure(
      `<${Tn(e, e.type)}> ${t}`,
      n,
      o
    ), Xe.clearMarks(n), Xe.clearMarks(o);
  }
  process.env.NODE_ENV !== "production" && ki(e, t, mn() ? Xe.now() : Date.now());
}
function mn() {
  return St !== void 0 || (typeof window < "u" && window.performance ? (St = !0, Xe = window.performance) : St = !1), St;
}
function Rc() {
  const e = [];
  if (process.env.NODE_ENV !== "production" && e.length) {
    const t = e.length > 1;
    console.warn(
      `Feature flag${t ? "s" : ""} ${e.join(", ")} ${t ? "are" : "is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
    );
  }
}
const he = zc;
function Mc(e) {
  return Fc(e);
}
function Fc(e, t) {
  Rc();
  const n = Wt();
  n.__VUE__ = !0, process.env.NODE_ENV !== "production" && No(n.__VUE_DEVTOOLS_GLOBAL_HOOK__, n);
  const {
    insert: o,
    remove: s,
    patchProp: r,
    createElement: i,
    createText: c,
    createComment: u,
    setText: p,
    setElementText: d,
    parentNode: a,
    nextSibling: _,
    setScopeId: w = Y,
    insertStaticContent: V
  } = e, $ = (l, f, h, v = null, g = null, m = null, O = void 0, N = null, b = process.env.NODE_ENV !== "production" && Fe ? !1 : !!f.dynamicChildren) => {
    if (l === f)
      return;
    l && !Ct(l, f) && (v = zt(l), qe(l, g, m, !0), l = null), f.patchFlag === -2 && (b = !1, f.dynamicChildren = null);
    const { type: E, ref: S, shapeFlag: x } = f;
    switch (E) {
      case Gt:
        ee(l, f, h, v);
        break;
      case we:
        W(l, f, h, v);
        break;
      case sn:
        l == null ? J(f, h, v, O) : process.env.NODE_ENV !== "production" && L(l, f, h, O);
        break;
      case Ie:
        Jt(
          l,
          f,
          h,
          v,
          g,
          m,
          O,
          N,
          b
        );
        break;
      default:
        x & 1 ? Z(
          l,
          f,
          h,
          v,
          g,
          m,
          O,
          N,
          b
        ) : x & 6 ? Po(
          l,
          f,
          h,
          v,
          g,
          m,
          O,
          N,
          b
        ) : x & 64 || x & 128 ? E.process(
          l,
          f,
          h,
          v,
          g,
          m,
          O,
          N,
          b,
          xt
        ) : process.env.NODE_ENV !== "production" && y("Invalid VNode type:", E, `(${typeof E})`);
    }
    S != null && g && _n(S, l && l.ref, m, f || l, !f);
  }, ee = (l, f, h, v) => {
    if (l == null)
      o(
        f.el = c(f.children),
        h,
        v
      );
    else {
      const g = f.el = l.el;
      f.children !== l.children && p(g, f.children);
    }
  }, W = (l, f, h, v) => {
    l == null ? o(
      f.el = u(f.children || ""),
      h,
      v
    ) : f.el = l.el;
  }, J = (l, f, h, v) => {
    [l.el, l.anchor] = V(
      l.children,
      f,
      h,
      v,
      l.el,
      l.anchor
    );
  }, L = (l, f, h, v) => {
    if (f.children !== l.children) {
      const g = _(l.anchor);
      T(l), [f.el, f.anchor] = V(
        f.children,
        h,
        g,
        v
      );
    } else
      f.el = l.el, f.anchor = l.anchor;
  }, de = ({ el: l, anchor: f }, h, v) => {
    let g;
    for (; l && l !== f; )
      g = _(l), o(l, h, v), l = g;
    o(f, h, v);
  }, T = ({ el: l, anchor: f }) => {
    let h;
    for (; l && l !== f; )
      h = _(l), s(l), l = h;
    s(f);
  }, Z = (l, f, h, v, g, m, O, N, b) => {
    f.type === "svg" ? O = "svg" : f.type === "math" && (O = "mathml"), l == null ? Ee(
      f,
      h,
      v,
      g,
      m,
      O,
      N,
      b
    ) : Le(
      l,
      f,
      g,
      m,
      O,
      N,
      b
    );
  }, Ee = (l, f, h, v, g, m, O, N) => {
    let b, E;
    const { props: S, shapeFlag: x, transition: D, dirs: P } = l;
    if (b = l.el = i(
      l.type,
      m,
      S && S.is,
      S
    ), x & 8 ? d(b, l.children) : x & 16 && ie(
      l.children,
      b,
      null,
      v,
      g,
      Un(l, m),
      O,
      N
    ), P && nt(l, null, v, "created"), te(b, l, l.scopeId, O, v), S) {
      for (const k in S)
        k !== "value" && !Pt(k) && r(b, k, null, S[k], m, v);
      "value" in S && r(b, "value", null, S.value, m), (E = S.onVnodeBeforeMount) && Pe(E, v, l);
    }
    process.env.NODE_ENV !== "production" && (fn(b, "__vnode", l, !0), fn(b, "__vueParentComponent", v, !0)), P && nt(l, null, v, "beforeMount");
    const F = jc(g, D);
    F && D.beforeEnter(b), o(b, f, h), ((E = S && S.onVnodeMounted) || F || P) && he(() => {
      E && Pe(E, v, l), F && D.enter(b), P && nt(l, null, v, "mounted");
    }, g);
  }, te = (l, f, h, v, g) => {
    if (h && w(l, h), v)
      for (let m = 0; m < v.length; m++)
        w(l, v[m]);
    if (g) {
      let m = g.subTree;
      if (process.env.NODE_ENV !== "production" && m.patchFlag > 0 && m.patchFlag & 2048 && (m = So(m.children) || m), f === m || Or(m.type) && (m.ssContent === f || m.ssFallback === f)) {
        const O = g.vnode;
        te(
          l,
          O,
          O.scopeId,
          O.slotScopeIds,
          g.parent
        );
      }
    }
  }, ie = (l, f, h, v, g, m, O, N, b = 0) => {
    for (let E = b; E < l.length; E++) {
      const S = l[E] = N ? ze(l[E]) : ye(l[E]);
      $(
        null,
        S,
        f,
        h,
        v,
        g,
        m,
        O,
        N
      );
    }
  }, Le = (l, f, h, v, g, m, O) => {
    const N = f.el = l.el;
    process.env.NODE_ENV !== "production" && (N.__vnode = f);
    let { patchFlag: b, dynamicChildren: E, dirs: S } = f;
    b |= l.patchFlag & 16;
    const x = l.props || B, D = f.props || B;
    let P;
    if (h && ot(h, !1), (P = D.onVnodeBeforeUpdate) && Pe(P, h, f, l), S && nt(f, l, h, "beforeUpdate"), h && ot(h, !0), process.env.NODE_ENV !== "production" && Fe && (b = 0, O = !1, E = null), (x.innerHTML && D.innerHTML == null || x.textContent && D.textContent == null) && d(N, ""), E ? (Ke(
      l.dynamicChildren,
      E,
      N,
      h,
      v,
      Un(f, g),
      m
    ), process.env.NODE_ENV !== "production" && on(l, f)) : O || Se(
      l,
      f,
      N,
      null,
      h,
      v,
      Un(f, g),
      m,
      !1
    ), b > 0) {
      if (b & 16)
        Ne(N, x, D, h, g);
      else if (b & 2 && x.class !== D.class && r(N, "class", null, D.class, g), b & 4 && r(N, "style", x.style, D.style, g), b & 8) {
        const F = f.dynamicProps;
        for (let k = 0; k < F.length; k++) {
          const U = F[k], pe = x[U], le = D[U];
          (le !== pe || U === "value") && r(N, U, pe, le, g, h);
        }
      }
      b & 1 && l.children !== f.children && d(N, f.children);
    } else !O && E == null && Ne(N, x, D, h, g);
    ((P = D.onVnodeUpdated) || S) && he(() => {
      P && Pe(P, h, f, l), S && nt(f, l, h, "updated");
    }, v);
  }, Ke = (l, f, h, v, g, m, O) => {
    for (let N = 0; N < f.length; N++) {
      const b = l[N], E = f[N], S = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        b.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (b.type === Ie || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Ct(b, E) || // - In the case of a component, it could contain anything.
        b.shapeFlag & 70) ? a(b.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          h
        )
      );
      $(
        b,
        E,
        S,
        null,
        v,
        g,
        m,
        O,
        !0
      );
    }
  }, Ne = (l, f, h, v, g) => {
    if (f !== h) {
      if (f !== B)
        for (const m in f)
          !Pt(m) && !(m in h) && r(
            l,
            m,
            f[m],
            null,
            g,
            v
          );
      for (const m in h) {
        if (Pt(m)) continue;
        const O = h[m], N = f[m];
        O !== N && m !== "value" && r(l, m, N, O, g, v);
      }
      "value" in h && r(l, "value", f.value, h.value, g);
    }
  }, Jt = (l, f, h, v, g, m, O, N, b) => {
    const E = f.el = l ? l.el : c(""), S = f.anchor = l ? l.anchor : c("");
    let { patchFlag: x, dynamicChildren: D, slotScopeIds: P } = f;
    process.env.NODE_ENV !== "production" && // #5523 dev root fragment may inherit directives
    (Fe || x & 2048) && (x = 0, b = !1, D = null), P && (N = N ? N.concat(P) : P), l == null ? (o(E, h, v), o(S, h, v), ie(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      f.children || [],
      h,
      S,
      g,
      m,
      O,
      N,
      b
    )) : x > 0 && x & 64 && D && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    l.dynamicChildren ? (Ke(
      l.dynamicChildren,
      D,
      h,
      g,
      m,
      O,
      N
    ), process.env.NODE_ENV !== "production" ? on(l, f) : (
      // #2080 if the stable fragment has a key, it's a <template v-for> that may
      //  get moved around. Make sure all root level vnodes inherit el.
      // #2134 or if it's a component root, it may also get moved around
      // as the component is being moved.
      (f.key != null || g && f === g.subTree) && on(
        l,
        f,
        !0
        /* shallow */
      )
    )) : Se(
      l,
      f,
      h,
      S,
      g,
      m,
      O,
      N,
      b
    );
  }, Po = (l, f, h, v, g, m, O, N, b) => {
    f.slotScopeIds = N, l == null ? f.shapeFlag & 512 ? g.ctx.activate(
      f,
      h,
      v,
      O,
      b
    ) : Ge(
      f,
      h,
      v,
      g,
      m,
      O,
      b
    ) : ce(l, f, b);
  }, Ge = (l, f, h, v, g, m, O) => {
    const N = l.component = il(
      l,
      v,
      g
    );
    if (process.env.NODE_ENV !== "production" && N.type.__hmrId && Ii(N), process.env.NODE_ENV !== "production" && (Qt(l), ht(N, "mount")), xo(l) && (N.ctx.renderer = xt), process.env.NODE_ENV !== "production" && ht(N, "init"), fl(N, !1, O), process.env.NODE_ENV !== "production" && _t(N, "init"), process.env.NODE_ENV !== "production" && Fe && (l.el = null), N.asyncDep) {
      if (g && g.registerDep(N, M, O), !l.el) {
        const b = N.subTree = Ze(we);
        W(null, b, f, h);
      }
    } else
      M(
        N,
        l,
        f,
        h,
        g,
        m,
        O
      );
    process.env.NODE_ENV !== "production" && (en(), _t(N, "mount"));
  }, ce = (l, f, h) => {
    const v = f.component = l.component;
    if (qc(l, f, h))
      if (v.asyncDep && !v.asyncResolved) {
        process.env.NODE_ENV !== "production" && Qt(f), R(v, f, h), process.env.NODE_ENV !== "production" && en();
        return;
      } else
        v.next = f, v.update();
    else
      f.el = l.el, v.vnode = f;
  }, M = (l, f, h, v, g, m, O) => {
    const N = () => {
      if (l.isMounted) {
        let { next: x, bu: D, u: P, parent: F, vnode: k } = l;
        {
          const Te = vr(l);
          if (Te) {
            x && (x.el = k.el, R(l, x, O)), Te.asyncDep.then(() => {
              l.isUnmounted || N();
            });
            return;
          }
        }
        let U = x, pe;
        process.env.NODE_ENV !== "production" && Qt(x || l.vnode), ot(l, !1), x ? (x.el = k.el, R(l, x, O)) : x = k, D && Dt(D), (pe = x.props && x.props.onVnodeBeforeUpdate) && Pe(pe, F, x, k), ot(l, !0), process.env.NODE_ENV !== "production" && ht(l, "render");
        const le = Xo(l);
        process.env.NODE_ENV !== "production" && _t(l, "render");
        const Ce = l.subTree;
        l.subTree = le, process.env.NODE_ENV !== "production" && ht(l, "patch"), $(
          Ce,
          le,
          // parent may have changed if it's in a teleport
          a(Ce.el),
          // anchor may have changed if it's in a fragment
          zt(Ce),
          l,
          g,
          m
        ), process.env.NODE_ENV !== "production" && _t(l, "patch"), x.el = le.el, U === null && Jc(l, le.el), P && he(P, g), (pe = x.props && x.props.onVnodeUpdated) && he(
          () => Pe(pe, F, x, k),
          g
        ), process.env.NODE_ENV !== "production" && Qs(l), process.env.NODE_ENV !== "production" && en();
      } else {
        let x;
        const { el: D, props: P } = f, { bm: F, m: k, parent: U, root: pe, type: le } = l, Ce = Rt(f);
        ot(l, !1), F && Dt(F), !Ce && (x = P && P.onVnodeBeforeMount) && Pe(x, U, f), ot(l, !0);
        {
          pe.ce && pe.ce._injectChildStyle(le), process.env.NODE_ENV !== "production" && ht(l, "render");
          const Te = l.subTree = Xo(l);
          process.env.NODE_ENV !== "production" && _t(l, "render"), process.env.NODE_ENV !== "production" && ht(l, "patch"), $(
            null,
            Te,
            h,
            v,
            l,
            g,
            m
          ), process.env.NODE_ENV !== "production" && _t(l, "patch"), f.el = Te.el;
        }
        if (k && he(k, g), !Ce && (x = P && P.onVnodeMounted)) {
          const Te = f;
          he(
            () => Pe(x, U, Te),
            g
          );
        }
        (f.shapeFlag & 256 || U && Rt(U.vnode) && U.vnode.shapeFlag & 256) && l.a && he(l.a, g), l.isMounted = !0, process.env.NODE_ENV !== "production" && Li(l), f = h = v = null;
      }
    };
    l.scope.on();
    const b = l.effect = new ws(N);
    l.scope.off();
    const E = l.update = b.run.bind(b), S = l.job = b.runIfDirty.bind(b);
    S.i = l, S.id = l.uid, b.scheduler = () => Dn(S), ot(l, !0), process.env.NODE_ENV !== "production" && (b.onTrack = l.rtc ? (x) => Dt(l.rtc, x) : void 0, b.onTrigger = l.rtg ? (x) => Dt(l.rtg, x) : void 0), E();
  }, R = (l, f, h) => {
    f.component = l;
    const v = l.vnode.props;
    l.vnode = f, l.next = null, xc(l, f.props, v, h), Ic(l, f.children, h), De(), Uo(l), Ve();
  }, Se = (l, f, h, v, g, m, O, N, b = !1) => {
    const E = l && l.children, S = l ? l.shapeFlag : 0, x = f.children, { patchFlag: D, shapeFlag: P } = f;
    if (D > 0) {
      if (D & 128) {
        yt(
          E,
          x,
          h,
          v,
          g,
          m,
          O,
          N,
          b
        );
        return;
      } else if (D & 256) {
        An(
          E,
          x,
          h,
          v,
          g,
          m,
          O,
          N,
          b
        );
        return;
      }
    }
    P & 8 ? (S & 16 && Ot(E, g, m), x !== E && d(h, x)) : S & 16 ? P & 16 ? yt(
      E,
      x,
      h,
      v,
      g,
      m,
      O,
      N,
      b
    ) : Ot(E, g, m, !0) : (S & 8 && d(h, ""), P & 16 && ie(
      x,
      h,
      v,
      g,
      m,
      O,
      N,
      b
    ));
  }, An = (l, f, h, v, g, m, O, N, b) => {
    l = l || mt, f = f || mt;
    const E = l.length, S = f.length, x = Math.min(E, S);
    let D;
    for (D = 0; D < x; D++) {
      const P = f[D] = b ? ze(f[D]) : ye(f[D]);
      $(
        l[D],
        P,
        h,
        null,
        g,
        m,
        O,
        N,
        b
      );
    }
    E > S ? Ot(
      l,
      g,
      m,
      !0,
      !1,
      x
    ) : ie(
      f,
      h,
      v,
      g,
      m,
      O,
      N,
      b,
      x
    );
  }, yt = (l, f, h, v, g, m, O, N, b) => {
    let E = 0;
    const S = f.length;
    let x = l.length - 1, D = S - 1;
    for (; E <= x && E <= D; ) {
      const P = l[E], F = f[E] = b ? ze(f[E]) : ye(f[E]);
      if (Ct(P, F))
        $(
          P,
          F,
          h,
          null,
          g,
          m,
          O,
          N,
          b
        );
      else
        break;
      E++;
    }
    for (; E <= x && E <= D; ) {
      const P = l[x], F = f[D] = b ? ze(f[D]) : ye(f[D]);
      if (Ct(P, F))
        $(
          P,
          F,
          h,
          null,
          g,
          m,
          O,
          N,
          b
        );
      else
        break;
      x--, D--;
    }
    if (E > x) {
      if (E <= D) {
        const P = D + 1, F = P < S ? f[P].el : v;
        for (; E <= D; )
          $(
            null,
            f[E] = b ? ze(f[E]) : ye(f[E]),
            h,
            F,
            g,
            m,
            O,
            N,
            b
          ), E++;
      }
    } else if (E > D)
      for (; E <= x; )
        qe(l[E], g, m, !0), E++;
    else {
      const P = E, F = E, k = /* @__PURE__ */ new Map();
      for (E = F; E <= D; E++) {
        const ne = f[E] = b ? ze(f[E]) : ye(f[E]);
        ne.key != null && (process.env.NODE_ENV !== "production" && k.has(ne.key) && y(
          "Duplicate keys found during update:",
          JSON.stringify(ne.key),
          "Make sure keys are unique."
        ), k.set(ne.key, E));
      }
      let U, pe = 0;
      const le = D - F + 1;
      let Ce = !1, Te = 0;
      const wt = new Array(le);
      for (E = 0; E < le; E++) wt[E] = 0;
      for (E = P; E <= x; E++) {
        const ne = l[E];
        if (pe >= le) {
          qe(ne, g, m, !0);
          continue;
        }
        let Ae;
        if (ne.key != null)
          Ae = k.get(ne.key);
        else
          for (U = F; U <= D; U++)
            if (wt[U - F] === 0 && Ct(ne, f[U])) {
              Ae = U;
              break;
            }
        Ae === void 0 ? qe(ne, g, m, !0) : (wt[Ae - F] = E + 1, Ae >= Te ? Te = Ae : Ce = !0, $(
          ne,
          f[Ae],
          h,
          null,
          g,
          m,
          O,
          N,
          b
        ), pe++);
      }
      const Io = Ce ? Hc(wt) : mt;
      for (U = Io.length - 1, E = le - 1; E >= 0; E--) {
        const ne = F + E, Ae = f[ne], Ro = ne + 1 < S ? f[ne + 1].el : v;
        wt[E] === 0 ? $(
          null,
          Ae,
          h,
          Ro,
          g,
          m,
          O,
          N,
          b
        ) : Ce && (U < 0 || E !== Io[U] ? dt(Ae, h, Ro, 2) : U--);
      }
    }
  }, dt = (l, f, h, v, g = null) => {
    const { el: m, type: O, transition: N, children: b, shapeFlag: E } = l;
    if (E & 6) {
      dt(l.component.subTree, f, h, v);
      return;
    }
    if (E & 128) {
      l.suspense.move(f, h, v);
      return;
    }
    if (E & 64) {
      O.move(l, f, h, xt);
      return;
    }
    if (O === Ie) {
      o(m, f, h);
      for (let x = 0; x < b.length; x++)
        dt(b[x], f, h, v);
      o(l.anchor, f, h);
      return;
    }
    if (O === sn) {
      de(l, f, h);
      return;
    }
    if (v !== 2 && E & 1 && N)
      if (v === 0)
        N.beforeEnter(m), o(m, f, h), he(() => N.enter(m), g);
      else {
        const { leave: x, delayLeave: D, afterLeave: P } = N, F = () => {
          l.ctx.isUnmounted ? s(m) : o(m, f, h);
        }, k = () => {
          x(m, () => {
            F(), P && P();
          });
        };
        D ? D(m, F, k) : k();
      }
    else
      o(m, f, h);
  }, qe = (l, f, h, v = !1, g = !1) => {
    const {
      type: m,
      props: O,
      ref: N,
      children: b,
      dynamicChildren: E,
      shapeFlag: S,
      patchFlag: x,
      dirs: D,
      cacheIndex: P
    } = l;
    if (x === -2 && (g = !1), N != null && (De(), _n(N, null, h, l, !0), Ve()), P != null && (f.renderCache[P] = void 0), S & 256) {
      f.ctx.deactivate(l);
      return;
    }
    const F = S & 1 && D, k = !Rt(l);
    let U;
    if (k && (U = O && O.onVnodeBeforeUnmount) && Pe(U, f, l), S & 6)
      Rr(l.component, h, v);
    else {
      if (S & 128) {
        l.suspense.unmount(h, v);
        return;
      }
      F && nt(l, null, f, "beforeUnmount"), S & 64 ? l.type.remove(
        l,
        f,
        h,
        xt,
        v
      ) : E && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !E.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (m !== Ie || x > 0 && x & 64) ? Ot(
        E,
        f,
        h,
        !1,
        !0
      ) : (m === Ie && x & 384 || !g && S & 16) && Ot(b, f, h), v && Pn(l);
    }
    (k && (U = O && O.onVnodeUnmounted) || F) && he(() => {
      U && Pe(U, f, l), F && nt(l, null, f, "unmounted");
    }, h);
  }, Pn = (l) => {
    const { type: f, el: h, anchor: v, transition: g } = l;
    if (f === Ie) {
      process.env.NODE_ENV !== "production" && l.patchFlag > 0 && l.patchFlag & 2048 && g && !g.persisted ? l.children.forEach((O) => {
        O.type === we ? s(O.el) : Pn(O);
      }) : Ir(h, v);
      return;
    }
    if (f === sn) {
      T(l);
      return;
    }
    const m = () => {
      s(h), g && !g.persisted && g.afterLeave && g.afterLeave();
    };
    if (l.shapeFlag & 1 && g && !g.persisted) {
      const { leave: O, delayLeave: N } = g, b = () => O(h, m);
      N ? N(l.el, m, b) : b();
    } else
      m();
  }, Ir = (l, f) => {
    let h;
    for (; l !== f; )
      h = _(l), s(l), l = h;
    s(f);
  }, Rr = (l, f, h) => {
    process.env.NODE_ENV !== "production" && l.type.__hmrId && Ri(l);
    const {
      bum: v,
      scope: g,
      job: m,
      subTree: O,
      um: N,
      m: b,
      a: E,
      parent: S,
      slots: { __: x }
    } = l;
    Yo(b), Yo(E), v && Dt(v), S && C(x) && x.forEach((D) => {
      S.renderCache[D] = void 0;
    }), g.stop(), m && (m.flags |= 8, qe(O, l, f, h)), N && he(N, f), he(() => {
      l.isUnmounted = !0;
    }, f), f && f.pendingBranch && !f.isUnmounted && l.asyncDep && !l.asyncResolved && l.suspenseId === f.pendingId && (f.deps--, f.deps === 0 && f.resolve()), process.env.NODE_ENV !== "production" && Bi(l);
  }, Ot = (l, f, h, v = !1, g = !1, m = 0) => {
    for (let O = m; O < l.length; O++)
      qe(l[O], f, h, v, g);
  }, zt = (l) => {
    if (l.shapeFlag & 6)
      return zt(l.component.subTree);
    if (l.shapeFlag & 128)
      return l.suspense.next();
    const f = _(l.anchor || l.el), h = f && f[qi];
    return h ? _(h) : f;
  };
  let $n = !1;
  const $o = (l, f, h) => {
    l == null ? f._vnode && qe(f._vnode, null, null, !0) : $(
      f._vnode || null,
      l,
      f,
      null,
      null,
      null,
      h
    ), f._vnode = l, $n || ($n = !0, Uo(), Ys(), $n = !1);
  }, xt = {
    p: $,
    um: qe,
    m: dt,
    r: Pn,
    mt: Ge,
    mc: ie,
    pc: Se,
    pbc: Ke,
    n: zt,
    o: e
  };
  return {
    render: $o,
    hydrate: void 0,
    createApp: bc($o)
  };
}
function Un({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function ot({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function jc(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function on(e, t, n = !1) {
  const o = e.children, s = t.children;
  if (C(o) && C(s))
    for (let r = 0; r < o.length; r++) {
      const i = o[r];
      let c = s[r];
      c.shapeFlag & 1 && !c.dynamicChildren && ((c.patchFlag <= 0 || c.patchFlag === 32) && (c = s[r] = ze(s[r]), c.el = i.el), !n && c.patchFlag !== -2 && on(i, c)), c.type === Gt && (c.el = i.el), c.type === we && !c.el && (c.el = i.el), process.env.NODE_ENV !== "production" && c.el && (c.el.__vnode = c);
    }
}
function Hc(e) {
  const t = e.slice(), n = [0];
  let o, s, r, i, c;
  const u = e.length;
  for (o = 0; o < u; o++) {
    const p = e[o];
    if (p !== 0) {
      if (s = n[n.length - 1], e[s] < p) {
        t[o] = s, n.push(o);
        continue;
      }
      for (r = 0, i = n.length - 1; r < i; )
        c = r + i >> 1, e[n[c]] < p ? r = c + 1 : i = c;
      p < e[n[r]] && (r > 0 && (t[o] = n[r - 1]), n[r] = o);
    }
  }
  for (r = n.length, i = n[r - 1]; r-- > 0; )
    n[r] = i, i = t[i];
  return n;
}
function vr(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : vr(t);
}
function Yo(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const Lc = Symbol.for("v-scx"), Uc = () => {
  {
    const e = nn(Lc);
    return e || process.env.NODE_ENV !== "production" && y(
      "Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."
    ), e;
  }
};
function Bn(e, t, n) {
  return process.env.NODE_ENV !== "production" && !A(t) && y(
    "`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."
  ), Er(e, t, n);
}
function Er(e, t, n = B) {
  const { immediate: o, deep: s, flush: r, once: i } = n;
  process.env.NODE_ENV !== "production" && !t && (o !== void 0 && y(
    'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
  ), s !== void 0 && y(
    'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
  ), i !== void 0 && y(
    'watch() "once" option is only respected when using the watch(source, callback, options?) signature.'
  ));
  const c = G({}, n);
  process.env.NODE_ENV !== "production" && (c.onWarn = y);
  const u = t && o || !t && r !== "post";
  let p;
  if (Ut) {
    if (r === "sync") {
      const w = Uc();
      p = w.__watcherHandles || (w.__watcherHandles = []);
    } else if (!u) {
      const w = () => {
      };
      return w.stop = Y, w.resume = Y, w.pause = Y, w;
    }
  }
  const d = Q;
  c.call = (w, V, $) => He(w, d, V, $);
  let a = !1;
  r === "post" ? c.scheduler = (w) => {
    he(w, d && d.suspense);
  } : r !== "sync" && (a = !0, c.scheduler = (w, V) => {
    V ? w() : Dn(w);
  }), c.augmentJob = (w) => {
    t && (w.flags |= 4), a && (w.flags |= 2, d && (w.id = d.uid, w.i = d));
  };
  const _ = Di(e, t, c);
  return Ut && (p ? p.push(_) : u && _()), _;
}
function Bc(e, t, n) {
  const o = this.proxy, s = q(e) ? e.includes(".") ? br(o, e) : () => o[e] : e.bind(o, o);
  let r;
  A(t) ? r = t : (r = t.handler, n = t);
  const i = qt(this), c = Er(s, r.bind(o), n);
  return i(), c;
}
function br(e, t) {
  const n = t.split(".");
  return () => {
    let o = e;
    for (let s = 0; s < n.length && o; s++)
      o = o[n[s]];
    return o;
  };
}
const Wc = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ae(t)}Modifiers`] || e[`${ge(t)}Modifiers`];
function kc(e, t, ...n) {
  if (e.isUnmounted) return;
  const o = e.vnode.props || B;
  if (process.env.NODE_ENV !== "production") {
    const {
      emitsOptions: d,
      propsOptions: [a]
    } = e;
    if (d)
      if (!(t in d))
        (!a || !(st(ae(t)) in a)) && y(
          `Component emitted event "${t}" but it is neither declared in the emits option nor as an "${st(ae(t))}" prop.`
        );
      else {
        const _ = d[t];
        A(_) && (_(...n) || y(
          `Invalid event arguments: event validation failed for event "${t}".`
        ));
      }
  }
  let s = n;
  const r = t.startsWith("update:"), i = r && Wc(o, t.slice(7));
  if (i && (i.trim && (s = n.map((d) => q(d) ? d.trim() : d)), i.number && (s = n.map(Ur))), process.env.NODE_ENV !== "production" && Ki(e, t, s), process.env.NODE_ENV !== "production") {
    const d = t.toLowerCase();
    d !== t && o[st(d)] && y(
      `Event "${d}" is emitted in component ${Tn(
        e,
        e.type
      )} but the handler is registered for "${t}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${ge(
        t
      )}" instead of "${t}".`
    );
  }
  let c, u = o[c = st(t)] || // also try camelCase event handler (#2249)
  o[c = st(ae(t))];
  !u && r && (u = o[c = st(ge(t))]), u && He(
    u,
    e,
    6,
    s
  );
  const p = o[c + "Once"];
  if (p) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[c])
      return;
    e.emitted[c] = !0, He(
      p,
      e,
      6,
      s
    );
  }
}
function Nr(e, t, n = !1) {
  const o = t.emitsCache, s = o.get(e);
  if (s !== void 0)
    return s;
  const r = e.emits;
  let i = {}, c = !1;
  if (!A(e)) {
    const u = (p) => {
      const d = Nr(p, t, !0);
      d && (c = !0, G(i, d));
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  return !r && !c ? (K(e) && o.set(e, null), null) : (C(r) ? r.forEach((u) => i[u] = null) : G(i, r), K(e) && o.set(e, i), i);
}
function Sn(e, t) {
  return !e || !Bt(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), j(e, t[0].toLowerCase() + t.slice(1)) || j(e, ge(t)) || j(e, t));
}
let oo = !1;
function vn() {
  oo = !0;
}
function Xo(e) {
  const {
    type: t,
    vnode: n,
    proxy: o,
    withProxy: s,
    propsOptions: [r],
    slots: i,
    attrs: c,
    emit: u,
    render: p,
    renderCache: d,
    props: a,
    data: _,
    setupState: w,
    ctx: V,
    inheritAttrs: $
  } = e, ee = hn(e);
  let W, J;
  process.env.NODE_ENV !== "production" && (oo = !1);
  try {
    if (n.shapeFlag & 4) {
      const T = s || o, Z = process.env.NODE_ENV !== "production" && w.__isScriptSetup ? new Proxy(T, {
        get(Ee, te, ie) {
          return y(
            `Property '${String(
              te
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          ), Reflect.get(Ee, te, ie);
        }
      }) : T;
      W = ye(
        p.call(
          Z,
          T,
          d,
          process.env.NODE_ENV !== "production" ? Me(a) : a,
          w,
          _,
          V
        )
      ), J = c;
    } else {
      const T = t;
      process.env.NODE_ENV !== "production" && c === a && vn(), W = ye(
        T.length > 1 ? T(
          process.env.NODE_ENV !== "production" ? Me(a) : a,
          process.env.NODE_ENV !== "production" ? {
            get attrs() {
              return vn(), Me(c);
            },
            slots: i,
            emit: u
          } : { attrs: c, slots: i, emit: u }
        ) : T(
          process.env.NODE_ENV !== "production" ? Me(a) : a,
          null
        )
      ), J = t.props ? c : Kc(c);
    }
  } catch (T) {
    Mt.length = 0, kt(T, e, 1), W = Ze(we);
  }
  let L = W, de;
  if (process.env.NODE_ENV !== "production" && W.patchFlag > 0 && W.patchFlag & 2048 && ([L, de] = yr(W)), J && $ !== !1) {
    const T = Object.keys(J), { shapeFlag: Z } = L;
    if (T.length) {
      if (Z & 7)
        r && T.some(ln) && (J = Gc(
          J,
          r
        )), L = et(L, J, !1, !0);
      else if (process.env.NODE_ENV !== "production" && !oo && L.type !== we) {
        const Ee = Object.keys(c), te = [], ie = [];
        for (let Le = 0, Ke = Ee.length; Le < Ke; Le++) {
          const Ne = Ee[Le];
          Bt(Ne) ? ln(Ne) || te.push(Ne[2].toLowerCase() + Ne.slice(3)) : ie.push(Ne);
        }
        ie.length && y(
          `Extraneous non-props attributes (${ie.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
        ), te.length && y(
          `Extraneous non-emits event listeners (${te.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
        );
      }
    }
  }
  return n.dirs && (process.env.NODE_ENV !== "production" && !Zo(L) && y(
    "Runtime directive used on component with non-element root node. The directives will not function as intended."
  ), L = et(L, null, !1, !0), L.dirs = L.dirs ? L.dirs.concat(n.dirs) : n.dirs), n.transition && (process.env.NODE_ENV !== "production" && !Zo(L) && y(
    "Component inside <Transition> renders non-element root node that cannot be animated."
  ), Oo(L, n.transition)), process.env.NODE_ENV !== "production" && de ? de(L) : W = L, hn(ee), W;
}
const yr = (e) => {
  const t = e.children, n = e.dynamicChildren, o = So(t, !1);
  if (o) {
    if (process.env.NODE_ENV !== "production" && o.patchFlag > 0 && o.patchFlag & 2048)
      return yr(o);
  } else return [e, void 0];
  const s = t.indexOf(o), r = n ? n.indexOf(o) : -1, i = (c) => {
    t[s] = c, n && (r > -1 ? n[r] = c : c.patchFlag > 0 && (e.dynamicChildren = [...n, c]));
  };
  return [ye(o), i];
};
function So(e, t = !0) {
  let n;
  for (let o = 0; o < e.length; o++) {
    const s = e[o];
    if (Cn(s)) {
      if (s.type !== we || s.children === "v-if") {
        if (n)
          return;
        if (n = s, process.env.NODE_ENV !== "production" && t && n.patchFlag > 0 && n.patchFlag & 2048)
          return So(n.children);
      }
    } else
      return;
  }
  return n;
}
const Kc = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || Bt(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Gc = (e, t) => {
  const n = {};
  for (const o in e)
    (!ln(o) || !(o.slice(9) in t)) && (n[o] = e[o]);
  return n;
}, Zo = (e) => e.shapeFlag & 7 || e.type === we;
function qc(e, t, n) {
  const { props: o, children: s, component: r } = e, { props: i, children: c, patchFlag: u } = t, p = r.emitsOptions;
  if (process.env.NODE_ENV !== "production" && (s || c) && Fe || t.dirs || t.transition)
    return !0;
  if (n && u >= 0) {
    if (u & 1024)
      return !0;
    if (u & 16)
      return o ? Qo(o, i, p) : !!i;
    if (u & 8) {
      const d = t.dynamicProps;
      for (let a = 0; a < d.length; a++) {
        const _ = d[a];
        if (i[_] !== o[_] && !Sn(p, _))
          return !0;
      }
    }
  } else
    return (s || c) && (!c || !c.$stable) ? !0 : o === i ? !1 : o ? i ? Qo(o, i, p) : !0 : !!i;
  return !1;
}
function Qo(e, t, n) {
  const o = Object.keys(t);
  if (o.length !== Object.keys(e).length)
    return !0;
  for (let s = 0; s < o.length; s++) {
    const r = o[s];
    if (t[r] !== e[r] && !Sn(n, r))
      return !0;
  }
  return !1;
}
function Jc({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const o = t.subTree;
    if (o.suspense && o.suspense.activeBranch === e && (o.el = e.el), o === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const Or = (e) => e.__isSuspense;
function zc(e, t) {
  t && t.pendingBranch ? C(e) ? t.effects.push(...e) : t.effects.push(e) : zs(e);
}
const Ie = Symbol.for("v-fgt"), Gt = Symbol.for("v-txt"), we = Symbol.for("v-cmt"), sn = Symbol.for("v-stc"), Mt = [];
let me = null;
function Yc(e = !1) {
  Mt.push(me = e ? null : []);
}
function Xc() {
  Mt.pop(), me = Mt[Mt.length - 1] || null;
}
let Lt = 1;
function es(e, t = !1) {
  Lt += e, e < 0 && me && t && (me.hasOnce = !0);
}
function Zc(e) {
  return e.dynamicChildren = Lt > 0 ? me || mt : null, Xc(), Lt > 0 && me && me.push(e), e;
}
function Qc(e, t, n, o, s, r) {
  return Zc(
    se(
      e,
      t,
      n,
      o,
      s,
      r,
      !0
    )
  );
}
function Cn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Ct(e, t) {
  if (process.env.NODE_ENV !== "production" && t.shapeFlag & 6 && e.component) {
    const n = tn.get(t.type);
    if (n && n.has(e.component))
      return e.shapeFlag &= -257, t.shapeFlag &= -513, !1;
  }
  return e.type === t.type && e.key === t.key;
}
const el = (...e) => wr(
  ...e
), xr = ({ key: e }) => e ?? null, rn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? q(e) || X(e) || A(e) ? { i: ue, r: e, k: t, f: !!n } : e : null);
function se(e, t = null, n = null, o = 0, s = null, r = e === Ie ? 0 : 1, i = !1, c = !1) {
  const u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && xr(t),
    ref: t && rn(t),
    scopeId: tr,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: r,
    patchFlag: o,
    dynamicProps: s,
    dynamicChildren: null,
    appContext: null,
    ctx: ue
  };
  return c ? (Co(u, n), r & 128 && e.normalize(u)) : n && (u.shapeFlag |= q(n) ? 8 : 16), process.env.NODE_ENV !== "production" && u.key !== u.key && y("VNode created with invalid key (NaN). VNode type:", u.type), Lt > 0 && // avoid a block node from tracking itself
  !i && // has current parent block
  me && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (u.patchFlag > 0 || r & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  u.patchFlag !== 32 && me.push(u), u;
}
const Ze = process.env.NODE_ENV !== "production" ? el : wr;
function wr(e, t = null, n = null, o = 0, s = null, r = !1) {
  if ((!e || e === fc) && (process.env.NODE_ENV !== "production" && !e && y(`Invalid vnode type when creating vnode: ${e}.`), e = we), Cn(e)) {
    const c = et(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Co(c, n), Lt > 0 && !r && me && (c.shapeFlag & 6 ? me[me.indexOf(e)] = c : me.push(c)), c.patchFlag = -2, c;
  }
  if (Tr(e) && (e = e.__vccOpts), t) {
    t = tl(t);
    let { class: c, style: u } = t;
    c && !q(c) && (t.class = po(c)), K(u) && (un(u) && !C(u) && (u = G({}, u)), t.style = ao(u));
  }
  const i = q(e) ? 1 : Or(e) ? 128 : Ji(e) ? 64 : K(e) ? 4 : A(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && i & 4 && un(e) && (e = I(e), y(
    "Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), se(
    e,
    t,
    n,
    o,
    s,
    i,
    r,
    !0
  );
}
function tl(e) {
  return e ? un(e) || dr(e) ? G({}, e) : e : null;
}
function et(e, t, n = !1, o = !1) {
  const { props: s, ref: r, patchFlag: i, children: c, transition: u } = e, p = t ? ol(s || {}, t) : s, d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: p,
    key: p && xr(p),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && r ? C(r) ? r.concat(rn(t)) : [r, rn(t)] : rn(t)
    ) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && i === -1 && C(c) ? c.map(Dr) : c,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ie ? i === -1 ? 16 : i | 16 : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: u,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && et(e.ssContent),
    ssFallback: e.ssFallback && et(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return u && o && Oo(
    d,
    u.clone(d)
  ), d;
}
function Dr(e) {
  const t = et(e);
  return C(e.children) && (t.children = e.children.map(Dr)), t;
}
function nl(e = " ", t = 0) {
  return Ze(Gt, null, e, t);
}
function ye(e) {
  return e == null || typeof e == "boolean" ? Ze(we) : C(e) ? Ze(
    Ie,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Cn(e) ? ze(e) : Ze(Gt, null, String(e));
}
function ze(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : et(e);
}
function Co(e, t) {
  let n = 0;
  const { shapeFlag: o } = e;
  if (t == null)
    t = null;
  else if (C(t))
    n = 16;
  else if (typeof t == "object")
    if (o & 65) {
      const s = t.default;
      s && (s._c && (s._d = !1), Co(e, s()), s._c && (s._d = !0));
      return;
    } else {
      n = 32;
      const s = t._;
      !s && !dr(t) ? t._ctx = ue : s === 3 && ue && (ue.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else A(t) ? (t = { default: t, _ctx: ue }, n = 32) : (t = String(t), o & 64 ? (n = 16, t = [nl(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function ol(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    for (const s in o)
      if (s === "class")
        t.class !== o.class && (t.class = po([t.class, o.class]));
      else if (s === "style")
        t.style = ao([t.style, o.style]);
      else if (Bt(s)) {
        const r = t[s], i = o[s];
        i && r !== i && !(C(r) && r.includes(i)) && (t[s] = r ? [].concat(r, i) : i);
      } else s !== "" && (t[s] = o[s]);
  }
  return t;
}
function Pe(e, t, n, o = null) {
  He(e, t, 7, [
    n,
    o
  ]);
}
const sl = fr();
let rl = 0;
function il(e, t, n) {
  const o = e.type, s = (t ? t.appContext : e.appContext) || sl, r = {
    uid: rl++,
    vnode: e,
    type: o,
    parent: t,
    appContext: s,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new ei(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(s.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: hr(o, s),
    emitsOptions: Nr(o, s),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: B,
    // inheritAttrs
    inheritAttrs: o.inheritAttrs,
    // state
    ctx: B,
    data: B,
    props: B,
    attrs: B,
    slots: B,
    refs: B,
    setupState: B,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return process.env.NODE_ENV !== "production" ? r.ctx = uc(r) : r.ctx = { _: r }, r.root = t ? t.root : r, r.emit = kc.bind(null, r), e.ce && e.ce(r), r;
}
let Q = null;
const cl = () => Q || ue;
let En, so;
{
  const e = Wt(), t = (n, o) => {
    let s;
    return (s = e[n]) || (s = e[n] = []), s.push(o), (r) => {
      s.length > 1 ? s.forEach((i) => i(r)) : s[0](r);
    };
  };
  En = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Q = n
  ), so = t(
    "__VUE_SSR_SETTERS__",
    (n) => Ut = n
  );
}
const qt = (e) => {
  const t = Q;
  return En(e), e.scope.on(), () => {
    e.scope.off(), En(t);
  };
}, ts = () => {
  Q && Q.scope.off(), En(null);
}, ll = /* @__PURE__ */ We("slot,component");
function ro(e, { isNativeTag: t }) {
  (ll(e) || t(e)) && y(
    "Do not use built-in or reserved HTML elements as component id: " + e
  );
}
function Vr(e) {
  return e.vnode.shapeFlag & 4;
}
let Ut = !1;
function fl(e, t = !1, n = !1) {
  t && so(t);
  const { props: o, children: s } = e.vnode, r = Vr(e);
  yc(e, o, r, t), $c(e, s, n || t);
  const i = r ? ul(e, t) : void 0;
  return t && so(!1), i;
}
function ul(e, t) {
  var n;
  const o = e.type;
  if (process.env.NODE_ENV !== "production") {
    if (o.name && ro(o.name, e.appContext.config), o.components) {
      const r = Object.keys(o.components);
      for (let i = 0; i < r.length; i++)
        ro(r[i], e.appContext.config);
    }
    if (o.directives) {
      const r = Object.keys(o.directives);
      for (let i = 0; i < r.length; i++)
        nr(r[i]);
    }
    o.compilerOptions && al() && y(
      '"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.'
    );
  }
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ir), process.env.NODE_ENV !== "production" && ac(e);
  const { setup: s } = o;
  if (s) {
    De();
    const r = e.setupContext = s.length > 1 ? pl(e) : null, i = qt(e), c = Nt(
      s,
      e,
      0,
      [
        process.env.NODE_ENV !== "production" ? Me(e.props) : e.props,
        r
      ]
    ), u = lo(c);
    if (Ve(), i(), (u || e.sp) && !Rt(e) && or(e), u) {
      if (c.then(ts, ts), t)
        return c.then((p) => {
          ns(e, p, t);
        }).catch((p) => {
          kt(p, e, 0);
        });
      if (e.asyncDep = c, process.env.NODE_ENV !== "production" && !e.suspense) {
        const p = (n = o.name) != null ? n : "Anonymous";
        y(
          `Component <${p}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
        );
      }
    } else
      ns(e, c, t);
  } else
    Sr(e, t);
}
function ns(e, t, n) {
  A(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : K(t) ? (process.env.NODE_ENV !== "production" && Cn(t) && y(
    "setup() should not return VNodes directly - return a render function instead."
  ), process.env.NODE_ENV !== "production" && (e.devtoolsRawSetupState = t), e.setupState = ks(t), process.env.NODE_ENV !== "production" && dc(e)) : process.env.NODE_ENV !== "production" && t !== void 0 && y(
    `setup() should return an object. Received: ${t === null ? "null" : typeof t}`
  ), Sr(e, n);
}
const al = () => !0;
function Sr(e, t, n) {
  const o = e.type;
  e.render || (e.render = o.render || Y);
  {
    const s = qt(e);
    De();
    try {
      hc(e);
    } finally {
      Ve(), s();
    }
  }
  process.env.NODE_ENV !== "production" && !o.render && e.render === Y && !t && (o.template ? y(
    'Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".'
  ) : y("Component is missing template or render function: ", o));
}
const os = process.env.NODE_ENV !== "production" ? {
  get(e, t) {
    return vn(), z(e, "get", ""), e[t];
  },
  set() {
    return y("setupContext.attrs is readonly."), !1;
  },
  deleteProperty() {
    return y("setupContext.attrs is readonly."), !1;
  }
} : {
  get(e, t) {
    return z(e, "get", ""), e[t];
  }
};
function dl(e) {
  return new Proxy(e.slots, {
    get(t, n) {
      return z(e, "get", "$slots"), t[n];
    }
  });
}
function pl(e) {
  const t = (n) => {
    if (process.env.NODE_ENV !== "production" && (e.exposed && y("expose() should be called only once per setup()."), n != null)) {
      let o = typeof n;
      o === "object" && (C(n) ? o = "array" : X(n) && (o = "ref")), o !== "object" && y(
        `expose() should be passed a plain object, received ${o}.`
      );
    }
    e.exposed = n || {};
  };
  if (process.env.NODE_ENV !== "production") {
    let n, o;
    return Object.freeze({
      get attrs() {
        return n || (n = new Proxy(e.attrs, os));
      },
      get slots() {
        return o || (o = dl(e));
      },
      get emit() {
        return (s, ...r) => e.emit(s, ...r);
      },
      expose: t
    });
  } else
    return {
      attrs: new Proxy(e.attrs, os),
      slots: e.slots,
      emit: e.emit,
      expose: t
    };
}
function To(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(ks(Ni(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in ut)
        return ut[n](e);
    },
    has(t, n) {
      return n in t || n in ut;
    }
  })) : e.proxy;
}
const hl = /(?:^|[-_])(\w)/g, _l = (e) => e.replace(hl, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function Cr(e, t = !0) {
  return A(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Tn(e, t, n = !1) {
  let o = Cr(t);
  if (!o && t.__file) {
    const s = t.__file.match(/([^/\\]+)\.\w+$/);
    s && (o = s[1]);
  }
  if (!o && e && e.parent) {
    const s = (r) => {
      for (const i in r)
        if (r[i] === t)
          return i;
    };
    o = s(
      e.components || e.parent.type.components
    ) || s(e.appContext.components);
  }
  return o ? _l(o) : n ? "App" : "Anonymous";
}
function Tr(e) {
  return A(e) && "__vccOpts" in e;
}
const gl = (e, t) => {
  const n = xi(e, t, Ut);
  if (process.env.NODE_ENV !== "production") {
    const o = cl();
    o && o.appContext.config.warnRecursiveComputed && (n._warnRecursive = !0);
  }
  return n;
};
function ml() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#1677ff" }, n = { style: "color:#f5222d" }, o = { style: "color:#eb2f96" }, s = {
    __vue_custom_formatter: !0,
    header(a) {
      if (!K(a))
        return null;
      if (a.__isVue)
        return ["div", e, "VueInstance"];
      if (X(a)) {
        De();
        const _ = a.value;
        return Ve(), [
          "div",
          {},
          ["span", e, d(a)],
          "<",
          c(_),
          ">"
        ];
      } else {
        if (vt(a))
          return [
            "div",
            {},
            ["span", e, ve(a) ? "ShallowReactive" : "Reactive"],
            "<",
            c(a),
            `>${Qe(a) ? " (readonly)" : ""}`
          ];
        if (Qe(a))
          return [
            "div",
            {},
            ["span", e, ve(a) ? "ShallowReadonly" : "Readonly"],
            "<",
            c(a),
            ">"
          ];
      }
      return null;
    },
    hasBody(a) {
      return a && a.__isVue;
    },
    body(a) {
      if (a && a.__isVue)
        return [
          "div",
          {},
          ...r(a.$)
        ];
    }
  };
  function r(a) {
    const _ = [];
    a.type.props && a.props && _.push(i("props", I(a.props))), a.setupState !== B && _.push(i("setup", a.setupState)), a.data !== B && _.push(i("data", I(a.data)));
    const w = u(a, "computed");
    w && _.push(i("computed", w));
    const V = u(a, "inject");
    return V && _.push(i("injected", V)), _.push([
      "div",
      {},
      [
        "span",
        {
          style: o.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: a }]
    ]), _;
  }
  function i(a, _) {
    return _ = G({}, _), Object.keys(_).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        a
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(_).map((w) => [
          "div",
          {},
          ["span", o, w + ": "],
          c(_[w], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function c(a, _ = !0) {
    return typeof a == "number" ? ["span", t, a] : typeof a == "string" ? ["span", n, JSON.stringify(a)] : typeof a == "boolean" ? ["span", o, a] : K(a) ? ["object", { object: _ ? I(a) : a }] : ["span", n, String(a)];
  }
  function u(a, _) {
    const w = a.type;
    if (A(w))
      return;
    const V = {};
    for (const $ in a.ctx)
      p(w, $, _) && (V[$] = a.ctx[$]);
    return V;
  }
  function p(a, _, w) {
    const V = a[w];
    if (C(V) && V.includes(_) || K(V) && _ in V || a.extends && p(a.extends, _, w) || a.mixins && a.mixins.some(($) => p($, _, w)))
      return !0;
  }
  function d(a) {
    return ve(a) ? "ShallowRef" : a.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(s) : window.devtoolsFormatters = [s];
}
const ss = "3.5.14", be = process.env.NODE_ENV !== "production" ? y : Y;
process.env.NODE_ENV;
process.env.NODE_ENV;
/**
* @vue/runtime-dom v3.5.14
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let io;
const rs = typeof window < "u" && window.trustedTypes;
if (rs)
  try {
    io = /* @__PURE__ */ rs.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch (e) {
    process.env.NODE_ENV !== "production" && be(`Error creating trusted types policy: ${e}`);
  }
const Ar = io ? (e) => io.createHTML(e) : (e) => e, vl = "http://www.w3.org/2000/svg", El = "http://www.w3.org/1998/Math/MathML", Be = typeof document < "u" ? document : null, is = Be && /* @__PURE__ */ Be.createElement("template"), bl = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, o) => {
    const s = t === "svg" ? Be.createElementNS(vl, e) : t === "mathml" ? Be.createElementNS(El, e) : n ? Be.createElement(e, { is: n }) : Be.createElement(e);
    return e === "select" && o && o.multiple != null && s.setAttribute("multiple", o.multiple), s;
  },
  createText: (e) => Be.createTextNode(e),
  createComment: (e) => Be.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Be.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, o, s, r) {
    const i = n ? n.previousSibling : t.lastChild;
    if (s && (s === r || s.nextSibling))
      for (; t.insertBefore(s.cloneNode(!0), n), !(s === r || !(s = s.nextSibling)); )
        ;
    else {
      is.innerHTML = Ar(
        o === "svg" ? `<svg>${e}</svg>` : o === "mathml" ? `<math>${e}</math>` : e
      );
      const c = is.content;
      if (o === "svg" || o === "mathml") {
        const u = c.firstChild;
        for (; u.firstChild; )
          c.appendChild(u.firstChild);
        c.removeChild(u);
      }
      t.insertBefore(c, n);
    }
    return [
      // first
      i ? i.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Nl = Symbol("_vtc");
function yl(e, t, n) {
  const o = e[Nl];
  o && (t = (t ? [t, ...o] : [...o]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const cs = Symbol("_vod"), Ol = Symbol("_vsh");
process.env.NODE_ENV;
const xl = Symbol(process.env.NODE_ENV !== "production" ? "CSS_VAR_TEXT" : ""), wl = /(^|;)\s*display\s*:/;
function Dl(e, t, n) {
  const o = e.style, s = q(n);
  let r = !1;
  if (n && !s) {
    if (t)
      if (q(t))
        for (const i of t.split(";")) {
          const c = i.slice(0, i.indexOf(":")).trim();
          n[c] == null && cn(o, c, "");
        }
      else
        for (const i in t)
          n[i] == null && cn(o, i, "");
    for (const i in n)
      i === "display" && (r = !0), cn(o, i, n[i]);
  } else if (s) {
    if (t !== n) {
      const i = o[xl];
      i && (n += ";" + i), o.cssText = n, r = wl.test(n);
    }
  } else t && e.removeAttribute("style");
  cs in e && (e[cs] = r ? o.display : "", e[Ol] && (o.display = "none"));
}
const Vl = /[^\\];\s*$/, ls = /\s*!important$/;
function cn(e, t, n) {
  if (C(n))
    n.forEach((o) => cn(e, t, o));
  else if (n == null && (n = ""), process.env.NODE_ENV !== "production" && Vl.test(n) && be(
    `Unexpected semicolon at the end of '${t}' style value: '${n}'`
  ), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const o = Sl(e, t);
    ls.test(n) ? e.setProperty(
      ge(o),
      n.replace(ls, ""),
      "important"
    ) : e[o] = n;
  }
}
const fs = ["Webkit", "Moz", "ms"], Wn = {};
function Sl(e, t) {
  const n = Wn[t];
  if (n)
    return n;
  let o = ae(t);
  if (o !== "filter" && o in e)
    return Wn[t] = o;
  o = On(o);
  for (let s = 0; s < fs.length; s++) {
    const r = fs[s] + o;
    if (r in e)
      return Wn[t] = r;
  }
  return t;
}
const us = "http://www.w3.org/1999/xlink";
function as(e, t, n, o, s, r = Qr(t)) {
  o && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(us, t.slice(6, t.length)) : e.setAttributeNS(us, t, n) : n == null || r && !ys(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    r ? "" : tt(n) ? String(n) : n
  );
}
function ds(e, t, n, o, s) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Ar(n) : n);
    return;
  }
  const r = e.tagName;
  if (t === "value" && r !== "PROGRESS" && // custom elements may use _value internally
  !r.includes("-")) {
    const c = r === "OPTION" ? e.getAttribute("value") || "" : e.value, u = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (c !== u || !("_value" in e)) && (e.value = u), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let i = !1;
  if (n === "" || n == null) {
    const c = typeof e[t];
    c === "boolean" ? n = ys(n) : n == null && c === "string" ? (n = "", i = !0) : c === "number" && (n = 0, i = !0);
  }
  try {
    e[t] = n;
  } catch (c) {
    process.env.NODE_ENV !== "production" && !i && be(
      `Failed setting prop "${t}" on <${r.toLowerCase()}>: value ${n} is invalid.`,
      c
    );
  }
  i && e.removeAttribute(s || t);
}
function Cl(e, t, n, o) {
  e.addEventListener(t, n, o);
}
function Tl(e, t, n, o) {
  e.removeEventListener(t, n, o);
}
const ps = Symbol("_vei");
function Al(e, t, n, o, s = null) {
  const r = e[ps] || (e[ps] = {}), i = r[t];
  if (o && i)
    i.value = process.env.NODE_ENV !== "production" ? _s(o, t) : o;
  else {
    const [c, u] = Pl(t);
    if (o) {
      const p = r[t] = Rl(
        process.env.NODE_ENV !== "production" ? _s(o, t) : o,
        s
      );
      Cl(e, c, p, u);
    } else i && (Tl(e, c, i, u), r[t] = void 0);
  }
}
const hs = /(?:Once|Passive|Capture)$/;
function Pl(e) {
  let t;
  if (hs.test(e)) {
    t = {};
    let o;
    for (; o = e.match(hs); )
      e = e.slice(0, e.length - o[0].length), t[o[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : ge(e.slice(2)), t];
}
let kn = 0;
const $l = /* @__PURE__ */ Promise.resolve(), Il = () => kn || ($l.then(() => kn = 0), kn = Date.now());
function Rl(e, t) {
  const n = (o) => {
    if (!o._vts)
      o._vts = Date.now();
    else if (o._vts <= n.attached)
      return;
    He(
      Ml(o, n.value),
      t,
      5,
      [o]
    );
  };
  return n.value = e, n.attached = Il(), n;
}
function _s(e, t) {
  return A(e) || C(e) ? e : (be(
    `Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`
  ), Y);
}
function Ml(e, t) {
  if (C(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (o) => (s) => !s._stopped && o && o(s)
    );
  } else
    return t;
}
const gs = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Fl = (e, t, n, o, s, r) => {
  const i = s === "svg";
  t === "class" ? yl(e, o, i) : t === "style" ? Dl(e, n, o) : Bt(t) ? ln(t) || Al(e, t, n, o, r) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : jl(e, t, o, i)) ? (ds(e, t, o), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && as(e, t, o, i, r, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !q(o)) ? ds(e, ae(t), o, r, t) : (t === "true-value" ? e._trueValue = o : t === "false-value" && (e._falseValue = o), as(e, t, o, i));
};
function jl(e, t, n, o) {
  if (o)
    return !!(t === "innerHTML" || t === "textContent" || t in e && gs(t) && A(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const s = e.tagName;
    if (s === "IMG" || s === "VIDEO" || s === "CANVAS" || s === "SOURCE")
      return !1;
  }
  return gs(t) && q(n) ? !1 : t in e;
}
const ms = {};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function Hl(e, t, n) {
  const o = /* @__PURE__ */ zi(e, t);
  Nn(o) && G(o, t);
  class s extends Ao {
    constructor(i) {
      super(o, i, n);
    }
  }
  return s.def = o, s;
}
const Ll = typeof HTMLElement < "u" ? HTMLElement : class {
};
class Ao extends Ll {
  constructor(t, n = {}, o = Es) {
    super(), this._def = t, this._props = n, this._createApp = o, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._ob = null, this.shadowRoot && o !== Es ? this._root = this.shadowRoot : (process.env.NODE_ENV !== "production" && this.shadowRoot && be(
      "Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use `defineSSRCustomElement`."
    ), t.shadowRoot !== !1 ? (this.attachShadow({ mode: "open" }), this._root = this.shadowRoot) : this._root = this), this._def.__asyncLoader || this._resolveProps(this._def);
  }
  connectedCallback() {
    if (!this.isConnected) return;
    this.shadowRoot || this._parseSlots(), this._connected = !0;
    let t = this;
    for (; t = t && (t.parentNode || t.host); )
      if (t instanceof Ao) {
        this._parent = t;
        break;
      }
    this._instance || (this._resolved ? (this._setParent(), this._update()) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
      this._pendingResolve = void 0, this._resolveDef();
    }) : this._resolveDef());
  }
  _setParent(t = this._parent) {
    t && (this._instance.parent = t._instance, this._instance.provides = t._instance.provides);
  }
  disconnectedCallback() {
    this._connected = !1, qs(() => {
      this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null);
    });
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    if (this._pendingResolve)
      return;
    for (let o = 0; o < this.attributes.length; o++)
      this._setAttr(this.attributes[o].name);
    this._ob = new MutationObserver((o) => {
      for (const s of o)
        this._setAttr(s.attributeName);
    }), this._ob.observe(this, { attributes: !0 });
    const t = (o, s = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: r, styles: i } = o;
      let c;
      if (r && !C(r))
        for (const u in r) {
          const p = r[u];
          (p === Number || p && p.type === Number) && (u in this._props && (this._props[u] = Mo(this._props[u])), (c || (c = /* @__PURE__ */ Object.create(null)))[ae(u)] = !0);
        }
      this._numberProps = c, s && this._resolveProps(o), this.shadowRoot ? this._applyStyles(i) : process.env.NODE_ENV !== "production" && i && be(
        "Custom element style injection is not supported when using shadowRoot: false"
      ), this._mount(o);
    }, n = this._def.__asyncLoader;
    n ? this._pendingResolve = n().then(
      (o) => t(this._def = o, !0)
    ) : t(this._def);
  }
  _mount(t) {
    process.env.NODE_ENV !== "production" && !t.name && (t.name = "VueElement"), this._app = this._createApp(t), t.configureApp && t.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
    const n = this._instance && this._instance.exposed;
    if (n)
      for (const o in n)
        j(this, o) ? process.env.NODE_ENV !== "production" && be(`Exposed property "${o}" already exists on custom element.`) : Object.defineProperty(this, o, {
          // unwrap ref to be consistent with public instance behavior
          get: () => Ws(n[o])
        });
  }
  _resolveProps(t) {
    const { props: n } = t, o = C(n) ? n : Object.keys(n || {});
    for (const s of Object.keys(this))
      s[0] !== "_" && o.includes(s) && this._setProp(s, this[s]);
    for (const s of o.map(ae))
      Object.defineProperty(this, s, {
        get() {
          return this._getProp(s);
        },
        set(r) {
          this._setProp(s, r, !0, !0);
        }
      });
  }
  _setAttr(t) {
    if (t.startsWith("data-v-")) return;
    const n = this.hasAttribute(t);
    let o = n ? this.getAttribute(t) : ms;
    const s = ae(t);
    n && this._numberProps && this._numberProps[s] && (o = Mo(o)), this._setProp(s, o, !1, !0);
  }
  /**
   * @internal
   */
  _getProp(t) {
    return this._props[t];
  }
  /**
   * @internal
   */
  _setProp(t, n, o = !0, s = !1) {
    if (n !== this._props[t] && (n === ms ? delete this._props[t] : (this._props[t] = n, t === "key" && this._app && (this._app._ceVNode.key = n)), s && this._instance && this._update(), o)) {
      const r = this._ob;
      r && r.disconnect(), n === !0 ? this.setAttribute(ge(t), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(ge(t), n + "") : n || this.removeAttribute(ge(t)), r && r.observe(this, { attributes: !0 });
    }
  }
  _update() {
    Bl(this._createVNode(), this._root);
  }
  _createVNode() {
    const t = {};
    this.shadowRoot || (t.onVnodeMounted = t.onVnodeUpdated = this._renderSlots.bind(this));
    const n = Ze(this._def, G(t, this._props));
    return this._instance || (n.ce = (o) => {
      this._instance = o, o.ce = this, o.isCE = !0, process.env.NODE_ENV !== "production" && (o.ceReload = (r) => {
        this._styles && (this._styles.forEach((i) => this._root.removeChild(i)), this._styles.length = 0), this._applyStyles(r), this._instance = null, this._update();
      });
      const s = (r, i) => {
        this.dispatchEvent(
          new CustomEvent(
            r,
            Nn(i[0]) ? G({ detail: i }, i[0]) : { detail: i }
          )
        );
      };
      o.emit = (r, ...i) => {
        s(r, i), ge(r) !== r && s(ge(r), i);
      }, this._setParent();
    }), n;
  }
  _applyStyles(t, n) {
    if (!t) return;
    if (n) {
      if (n === this._def || this._styleChildren.has(n))
        return;
      this._styleChildren.add(n);
    }
    const o = this._nonce;
    for (let s = t.length - 1; s >= 0; s--) {
      const r = document.createElement("style");
      if (o && r.setAttribute("nonce", o), r.textContent = t[s], this.shadowRoot.prepend(r), process.env.NODE_ENV !== "production")
        if (n) {
          if (n.__hmrId) {
            this._childStyles || (this._childStyles = /* @__PURE__ */ new Map());
            let i = this._childStyles.get(n.__hmrId);
            i || this._childStyles.set(n.__hmrId, i = []), i.push(r);
          }
        } else
          (this._styles || (this._styles = [])).push(r);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const t = this._slots = {};
    let n;
    for (; n = this.firstChild; ) {
      const o = n.nodeType === 1 && n.getAttribute("slot") || "default";
      (t[o] || (t[o] = [])).push(n), this.removeChild(n);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const t = (this._teleportTarget || this).querySelectorAll("slot"), n = this._instance.type.__scopeId;
    for (let o = 0; o < t.length; o++) {
      const s = t[o], r = s.getAttribute("name") || "default", i = this._slots[r], c = s.parentNode;
      if (i)
        for (const u of i) {
          if (n && u.nodeType === 1) {
            const p = n + "-s", d = document.createTreeWalker(u, 1);
            u.setAttribute(p, "");
            let a;
            for (; a = d.nextNode(); )
              a.setAttribute(p, "");
          }
          c.insertBefore(u, s);
        }
      else
        for (; s.firstChild; ) c.insertBefore(s.firstChild, s);
      c.removeChild(s);
    }
  }
  /**
   * @internal
   */
  _injectChildStyle(t) {
    this._applyStyles(t.styles, t);
  }
  /**
   * @internal
   */
  _removeChildStyle(t) {
    if (process.env.NODE_ENV !== "production" && (this._styleChildren.delete(t), this._childStyles && t.__hmrId)) {
      const n = this._childStyles.get(t.__hmrId);
      n && (n.forEach((o) => this._root.removeChild(o)), n.length = 0);
    }
  }
}
const Ul = /* @__PURE__ */ G({ patchProp: Fl }, bl);
let vs;
function Pr() {
  return vs || (vs = Mc(Ul));
}
const Bl = (...e) => {
  Pr().render(...e);
}, Es = (...e) => {
  const t = Pr().createApp(...e);
  process.env.NODE_ENV !== "production" && (kl(t), Kl(t));
  const { mount: n } = t;
  return t.mount = (o) => {
    const s = Gl(o);
    if (!s) return;
    const r = t._component;
    !A(r) && !r.render && !r.template && (r.template = s.innerHTML), s.nodeType === 1 && (s.textContent = "");
    const i = n(s, !1, Wl(s));
    return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), i;
  }, t;
};
function Wl(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function kl(e) {
  Object.defineProperty(e.config, "isNativeTag", {
    value: (t) => zr(t) || Yr(t) || Xr(t),
    writable: !1
  });
}
function Kl(e) {
  {
    const t = e.config.isCustomElement;
    Object.defineProperty(e.config, "isCustomElement", {
      get() {
        return t;
      },
      set() {
        be(
          "The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead."
        );
      }
    });
    const n = e.config.compilerOptions, o = 'The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc';
    Object.defineProperty(e.config, "compilerOptions", {
      get() {
        return be(o), n;
      },
      set() {
        be(o);
      }
    });
  }
}
function Gl(e) {
  if (q(e)) {
    const t = document.querySelector(e);
    return process.env.NODE_ENV !== "production" && !t && be(
      `Failed to mount app: mount target selector "${e}" returned null.`
    ), t;
  }
  return process.env.NODE_ENV !== "production" && window.ShadowRoot && e instanceof window.ShadowRoot && e.mode === "closed" && be(
    'mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'
  ), e;
}
/**
* vue v3.5.14
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function ql() {
  ml();
}
process.env.NODE_ENV !== "production" && ql();
const Jl = ".vue-game-widget[data-v-21077b53]{font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;border-radius:8px;background:linear-gradient(to right,#4a2f80,#3a4780);color:#fff;box-shadow:0 4px 12px #0003}h2[data-v-21077b53]{text-align:center;margin-bottom:20px;font-size:1.5rem}.score-container[data-v-21077b53]{display:flex;justify-content:space-around;align-items:center}.team[data-v-21077b53]{text-align:center}h3[data-v-21077b53]{margin-bottom:10px;font-size:1.2rem}.score[data-v-21077b53]{font-size:3rem;font-weight:700;margin-bottom:15px;background-color:#fff3;border-radius:8px;padding:10px 20px}.divider[data-v-21077b53]{width:2px;height:120px;background-color:#ffffff4d}button[data-v-21077b53]{background-color:#6938b4;color:#fff;border:none;padding:8px 16px;font-size:1rem;border-radius:4px;cursor:pointer;transition:background-color .3s ease}button[data-v-21077b53]:hover{background-color:#7d4ccc}.controls[data-v-21077b53]{text-align:center;margin-top:20px}.reset-btn[data-v-21077b53]{background-color:#e64a4a}.reset-btn[data-v-21077b53]:hover{background-color:#ff5a5a}", zl = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, s] of t)
    n[o] = s;
  return n;
}, Yl = {
  name: "GameScoreWidget",
  data() {
    return {
      teamAScore: 0,
      teamBScore: 0
    };
  },
  methods: {
    incrementTeamA() {
      this.teamAScore++;
    },
    incrementTeamB() {
      this.teamBScore++;
    },
    resetScores() {
      this.teamAScore = 0, this.teamBScore = 0;
    }
  }
}, Xl = { class: "vue-game-widget" }, Zl = { class: "score-container" }, Ql = { class: "team" }, ef = { class: "score" }, tf = { class: "team" }, nf = { class: "score" }, of = { class: "controls" };
function sf(e, t, n, o, s, r) {
  return Yc(), Qc("div", Xl, [
    t[6] || (t[6] = se("h2", null, "Game Score Tracker (Vue Widget)", -1)),
    se("div", Zl, [
      se("div", Ql, [
        t[3] || (t[3] = se("h3", null, "Team A", -1)),
        se("div", ef, Kn(s.teamAScore), 1),
        se("button", {
          onClick: t[0] || (t[0] = (...i) => r.incrementTeamA && r.incrementTeamA(...i))
        }, "+1")
      ]),
      t[5] || (t[5] = se("div", { class: "divider" }, null, -1)),
      se("div", tf, [
        t[4] || (t[4] = se("h3", null, "Team B", -1)),
        se("div", nf, Kn(s.teamBScore), 1),
        se("button", {
          onClick: t[1] || (t[1] = (...i) => r.incrementTeamB && r.incrementTeamB(...i))
        }, "+1")
      ])
    ]),
    se("div", of, [
      se("button", {
        onClick: t[2] || (t[2] = (...i) => r.resetScores && r.resetScores(...i)),
        class: "reset-btn"
      }, "Reset Scores")
    ])
  ]);
}
const rf = /* @__PURE__ */ zl(Yl, [["render", sf], ["styles", [Jl]], ["__scopeId", "data-v-21077b53"]]), $r = /* @__PURE__ */ Hl(rf);
typeof window < "u" && (window.VueGameWidget = $r);
if (typeof window < "u" && typeof customElements < "u" && !customElements.get("vue-game-widget"))
  try {
    customElements.define("vue-game-widget", $r), console.log("Vue web component registered successfully");
  } catch (e) {
    console.error("Error registering vue-game-widget:", e);
  }
export {
  $r as VueGameWidget
};
