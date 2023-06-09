import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import { globalStyles } from "../styles.js"
import { tabStyles } from "./tab-bar-item.styles.js"

export const tabBarItemTagName = "ui-tab-bar-item"

@customElement(tabBarItemTagName)
export class TabBarItem extends LitElement {
	static styles = [globalStyles, tabStyles]

	@state() private itemClasses = {
		active: false
	}

	@property({ type: Boolean }) active: boolean = false

	render() {
		this.itemClasses.active = this.active

		return html`
			<div id="container" class=${classMap(this.itemClasses)}>
				<p><slot></slot></p>
				<div id="border"></div>
			</div>
		`
	}
}
