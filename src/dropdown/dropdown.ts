import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import { styleMap } from "lit/directives/style-map.js"
import { getGlobalStyleHtml } from "../utils.js"
import { DropdownOption, DropdownOptionType } from "../types.js"
import { chevronDownLightSvg } from "../svg/chevron-down-light.js"
import { globalStyles } from "../styles.js"
import { dropdownStyles } from "./dropdown.styles.js"

export const dropdownTagName = "ui-dropdown"

@customElement(dropdownTagName)
export class Dropdown extends LitElement {
	static styles = [globalStyles, dropdownStyles]

	@state() private dropdownButtonClasses = {
		disabled: false,
		active: false
	}
	@state() private dropdownOptionClasses = {
		"dropdown-option": true,
		selected: false,
		darkTheme: false
	}
	@state() private dropdownDividerClasses = {
		"dropdown-divider": true,
		darkTheme: false
	}
	@state() private dropdownContentClasses = {
		"slide-down-in": false,
		visible: false
	}
	@state() private dropdownButtonStyles = {
		width: "160px"
	}
	@state() private dropdownContentStyles = {
		width: "160px"
	}

	@state() private showItems: boolean = false
	@state() private buttonText: string = "Select an option"

	@property() label: string = ""
	@property({ type: Array }) options: DropdownOption[] = []
	@property() selectedKey: string = ""
	@property({ type: Number }) width: number = 160
	@property({ type: Boolean }) disabled: boolean = false

	connectedCallback() {
		super.connectedCallback()
		document.addEventListener("click", this.documentClick)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		document.removeEventListener("click", this.documentClick)
	}

	documentClick = (event: MouseEvent) => {
		if (event.target != this) {
			this.showItems = false
		}
	}

	dropdownButtonClick() {
		if (!this.disabled) {
			this.showItems = !this.showItems
		}
	}

	dropdownOptionClick(event: PointerEvent) {
		let key = (event.target as Element).getAttribute("key")
		if (key == null) return

		this.selectedKey = key
		this.dispatchEvent(
			new CustomEvent("change", {
				detail: { key }
			})
		)

		this.showItems = false
		this.updateDropdownButtonText()
	}

	updateDropdownButtonText() {
		// Get the selected item and set the button text
		let i = this.options.findIndex(option => option.key == this.selectedKey)
		if (i != -1) this.buttonText = this.options[i].value
		else this.buttonText = "Select an option"
	}

	getLabel() {
		if (this.label.length == 0) {
			return html``
		}

		return html`
			<label id="dropdown-label" for="dropdown-button">
				${this.label}
			</label>
		`
	}

	getDropdownOption(option: DropdownOption, selected: boolean) {
		if (option.type == DropdownOptionType.divider) {
			return html`
				<div class=${classMap(this.dropdownDividerClasses)}>
					<hr />
				</div>
			`
		} else {
			let classes = structuredClone(this.dropdownOptionClasses)
			classes.selected = selected

			return html`
				<button
					class=${classMap(classes)}
					key=${option.key}
					@click=${this.dropdownOptionClick}
				>
					${option.value}
				</button>
			`
		}
	}

	render() {
		// Update the UI based on the properties
		this.dropdownButtonClasses.disabled = this.disabled
		this.dropdownButtonClasses.active = this.showItems
		this.dropdownContentClasses["slide-down-in"] = this.showItems
		this.dropdownContentClasses.visible = this.showItems

		this.dropdownButtonStyles.width = `${this.width}px`
		this.dropdownContentStyles.width = `${this.width}px`

		this.updateDropdownButtonText()

		return html`
			${getGlobalStyleHtml()}

			<div id="dropdown">
				${this.getLabel()}

				<button
					id="dropdown-button"
					class=${classMap(this.dropdownButtonClasses)}
					style=${styleMap(this.dropdownButtonStyles)}
					name="dropdown-button"
					?aria-disabled=${this.disabled}
					@click=${this.dropdownButtonClick}
				>
					<span>${this.buttonText}</span>

					<div id="chevron-svg-container">
						${chevronDownLightSvg}
					</div>
				</button>

				<div
					id="dropdown-content"
					class=${classMap(this.dropdownContentClasses)}
					style=${styleMap(this.dropdownContentStyles)}
				>
					${this.options.map(option =>
						this.getDropdownOption(option, option.key == this.selectedKey)
					)}
				</div>
			</div>
		`
	}
}
