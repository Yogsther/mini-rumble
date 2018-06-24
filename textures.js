

/*---------- UI ----------*/
var titleScreenTextures = [

    "rumble/mini_logo.png",
    "rumble/hardcore_logo.png",
    "rumble/rumble_logo.png",
    "rumble/table.png",
    //alternate titlescreen textures
    "rumble/alt_ts/D/mini_logo_D.png",
    "rumble/alt_ts/D/rumble_logo_D.png",
    "rumble/alt_ts/D/hardcore_logo_D.png"
];

var onlineTextures = [
    "rumble/online_selection.png",
    "rumble/lobby_vanilla.png",
    "rumble/lobby_scramble.png",
    "rumble/lobby_locked.png",
    "rumble/lobby_lives.png",
    "rumble/lobby_hardcore.png",
    "rumble/input_field.png"
];

var inputSymbols = [
    //keyboard inputs
    "ui/input/pc/kb_37_left.png",
    "ui/input/pc/kb_38_up.png",
    "ui/input/pc/kb_39_right.png",
    "ui/input/pc/kb_40_down.png",
    "ui/input/pc/kb_88_x.png",
    "ui/input/pc/kb_90_z.png",

    /*nintendo switch controller inputs*/
    //sideways joycon
    "ui/input/ns/joycon_a.png",
    "ui/input/ns/joycon_b.png",
    "ui/input/ns/joycon_x.png",
    "ui/input/ns/joycon_y.png",

    //pro controller
    "ui/input/ns/procon_a.png",
    "ui/input/ns/procon_b.png",
    "ui/input/ns/procon_x.png",
    "ui/input/ns/procon_y.png",

    /*playstation controller inputs*/
    "ui/input/ps/ps_c.png",
    "ui/input/ps/ps_s.png",
    "ui/input/ps/ps_t.png",
    "ui/input/ps/ps_x.png",

    /*xbox controller inputs*/
    "ui/input/xb/xb_a.png",
    "ui/input/xb/xb_b.png",
    "ui/input/xb/xb_x.png",
    "ui/input/xb/xb_y.png"
];

var miniRumbleFont = [
    "fonts/miniRumble_font/0_0.png",
    "fonts/miniRumble_font/0_1.png",
    "fonts/miniRumble_font/0_2.png",
    "fonts/miniRumble_font/0_3.png",
    "fonts/miniRumble_font/0_4.png",
    "fonts/miniRumble_font/0_5.png",
    "fonts/miniRumble_font/0_6.png",
    "fonts/miniRumble_font/0_7.png",
    "fonts/miniRumble_font/0_8.png",
    "fonts/miniRumble_font/0_9.png",
    "fonts/miniRumble_font/0_and.png",
    "fonts/miniRumble_font/0_apostrophe.png",
    "fonts/miniRumble_font/0_backslash.png",
    "fonts/miniRumble_font/0_bracket_L.png",
    "fonts/miniRumble_font/0_bracket_R.png",
    "fonts/miniRumble_font/0_colon.png",
    "fonts/miniRumble_font/0_comma.png",
    "fonts/miniRumble_font/0_dash.png",
    "fonts/miniRumble_font/0_dot.png",
    "fonts/miniRumble_font/0_e_mark.png",
    "fonts/miniRumble_font/0_less.png",
    "fonts/miniRumble_font/0_more.png",
    "fonts/miniRumble_font/0_parenthesis_L.png",
    "fonts/miniRumble_font/0_parenthesis_R.png",
    "fonts/miniRumble_font/0_pct.png",
    "fonts/miniRumble_font/0_plus.png",
    "fonts/miniRumble_font/0_q_mark.png",
    "fonts/miniRumble_font/0_s_colon.png",
    "fonts/miniRumble_font/0_slash.png",
    "fonts/miniRumble_font/0_underscore.png",
    "fonts/miniRumble_font/0_vbar.png",
    "fonts/miniRumble_font/a.png",
    "fonts/miniRumble_font/b.png",
    "fonts/miniRumble_font/c.png",
    "fonts/miniRumble_font/d.png",
    "fonts/miniRumble_font/e.png",
    "fonts/miniRumble_font/f.png",
    "fonts/miniRumble_font/g.png",
    "fonts/miniRumble_font/h.png",
    "fonts/miniRumble_font/i.png",
    "fonts/miniRumble_font/j.png",
    "fonts/miniRumble_font/k.png",
    "fonts/miniRumble_font/l.png",
    "fonts/miniRumble_font/m.png",
    "fonts/miniRumble_font/n.png",
    "fonts/miniRumble_font/o.png",
    "fonts/miniRumble_font/p.png",
    "fonts/miniRumble_font/q.png",
    "fonts/miniRumble_font/r.png",
    "fonts/miniRumble_font/s.png",
    "fonts/miniRumble_font/t.png",
    "fonts/miniRumble_font/u.png",
    "fonts/miniRumble_font/v.png",
    "fonts/miniRumble_font/w.png",
    "fonts/miniRumble_font/x.png",
    "fonts/miniRumble_font/y.png",
    "fonts/miniRumble_font/z.png",
];

titleScreenTextures.forEach(texture => importTexture(texture));
onlineTextures.forEach(texture => importTexture(texture));
miniRumbleFont.forEach(font => importTexture(font));