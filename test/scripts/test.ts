import {
  BorderType,
  t_anim,
  t_app,
  t_border,
  t_entity,
  t_frame,
  t_htmlScreen,
  t_layer,
  t_loop,
  t_onKeyDown,
  t_onKeyPress,
  t_onKeyUp,
  t_pos,
  t_scene,
  t_size,
  t_sprite,
} from '../../mod.ts'

const canvas = document.querySelector('.canvas')!

const rabbit1 = `
  =.,
(  / 
`

const rabbit2 = `
  =..
(  / 
`

const rabbit3 = `
 ,.=
(  W
`

const treeData = `
  /\\  
 /,,\\ 
 /,,\\ 
/,,,,\\
  ||  
`

const houseData = `
  ____  
 /\\\\\\\\\\ 
/[]\\___\\
|..|.-.|
|||||_||
`

const rabbitAnim = t_anim(
  'idle',
  2000,
  t_frame(rabbit1, 2, ''),
  t_frame(rabbit2, 2, ''),
  t_frame(rabbit1, 2, ''),
  t_frame(rabbit2, 5, ''),
  t_frame(rabbit1, 2, ''),
  t_frame(rabbit2, 2, ''),
  t_frame(rabbit1, 2, ''),
  t_frame(rabbit3, 5, ''),
)

const houseSprite = t_sprite(houseData)
const treeSprite = t_sprite(treeData)

const rabbit = t_entity('rabbit', rabbitAnim, t_pos(20, 7))
const house = t_entity('house', houseSprite, t_pos(27, 4))
const tree = t_entity('tree', treeSprite, t_pos(5, 4))

rabbit.startAnim('idle')

const scene = t_scene(
  'start',
  t_size(40, 11),
  t_pos(10, 10),
  t_border(BorderType.Regular),
  t_layer(house, rabbit, tree, t_size(40, 11)),
  t_onKeyPress('e', () => {
    scene.size.resizeTo(60, 11, 0.1)
  }),
  t_onKeyPress('q', () => {
    scene.size.resizeTo(40, 11, 1)
  }),
  t_onKeyDown('d', () => {
    rabbit.pos.move(10, 0)
  }),
  t_onKeyUp('d', () => {
    rabbit.pos.move(0, 0)
  }),
  t_onKeyDown('a', () => {
    rabbit.pos.move(-10, 0)
  }),
  t_onKeyUp('a', () => {
    rabbit.pos.move(0, 0)
  }),
)

const screen = t_htmlScreen(canvas, 120, 28)
const loop = t_loop(60)

const app = t_app(screen, loop, scene)
app.start()
