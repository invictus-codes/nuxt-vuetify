import { config } from '@fortawesome/fontawesome-svg-core'
import { h, resolveComponent } from 'vue'
import type { IconProps, IconSet } from 'vuetify'

config.autoAddCss = true

const iconset = <IconSet>{
    component: (props: IconProps) => {
        const {
            icon,
            ...rest
        } = props
        const stringIcon = icon
        return h(props.tag, rest, [
            h(resolveComponent('FontAwesomeIcon'), {
                key: stringIcon,
                // TODO: https://github.com/FortAwesome/vue-fontawesome/issues/250
                icon: stringIcon.includes(' fa-')
                    ? stringIcon.split(' fa-')
                    : stringIcon,
            }),
        ])
    },
}

export { iconset }
