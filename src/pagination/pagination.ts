import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import { getGlobalStyleHtml } from "../utils.js"
import { globalStyles } from "../styles.js"
import { paginationStyles } from "./pagination.styles.js"
import { arrowLeftLightSvg } from "../svg/arrow-left-light.js"

export const paginationTagName = "ui-pagination"

@customElement(paginationTagName)
export class Pagination extends LitElement {
	static styles = [globalStyles, paginationStyles]

	@state() private backButtonClasses = {
		"pagination-button": true,
		"back-button": true,
		disabled: false
	}
	@state() private forwardButtonClasses = {
		"pagination-button": true,
		"forward-button": true,
		disabled: false
	}

	@state() private reducedStart: boolean = false
	@state() private reducedEnd: boolean = false

	@property({ type: Number }) pages: number = 1
	@property({ type: Number }) currentPage: number = 1

	backButtonClick() {
		if (this.currentPage > 1) {
			this.dispatchEvent(
				new CustomEvent("pageChange", {
					detail: { page: this.currentPage - 1 }
				})
			)
		}
	}

	forwardButtonClick() {
		if (this.currentPage < this.pages) {
			this.dispatchEvent(
				new CustomEvent("pageChange", {
					detail: { page: this.currentPage + 1 }
				})
			)
		}
	}

	pageButtonClick(index: number) {
		this.dispatchEvent(
			new CustomEvent("pageChange", {
				detail: { page: index }
			})
		)
	}

	getBackButton() {
		if (this.pages <= 0) return
		let disabled = this.currentPage == 1

		this.backButtonClasses.disabled = disabled

		return html`
			<button
				class=${classMap(this.backButtonClasses)}
				?aria-disabled=${disabled}
				@click=${this.backButtonClick}
			>
				${arrowLeftLightSvg}
			</button>
		`
	}

	getForwardButton() {
		if (this.pages <= 0) return
		let disabled = this.currentPage == this.pages

		this.forwardButtonClasses.disabled = disabled

		return html`
			<button
				class=${classMap(this.forwardButtonClasses)}
				?aria-disabled=${disabled}
				@click=${this.forwardButtonClick}
			>
				${arrowLeftLightSvg}
			</button>
		`
	}

	getPageButton(index: number) {
		if (this.pages > 1) {
			let pageButtonClasses = {
				"pagination-button": true,
				selected: index == this.currentPage
			}

			return html`
				<button
					class=${classMap(pageButtonClasses)}
					@click=${() => this.pageButtonClick(index)}
				>
					${index}
				</button>
			`
		}
	}

	getButtonPlaceholder() {
		let buttonPlaceholderClasses = {
			"button-placeholder": true
		}

		return html`
			<div class=${classMap(buttonPlaceholderClasses)}>
				<span>…</span>
			</div>
		`
	}

	getPageButtons() {
		let buttons = []
		let reducedStartAdded: boolean = false
		let reducedEndAdded: boolean = false

		for (let i = 0; i < this.pages; i++) {
			let index = i + 1

			// Check if the current index is within the reduced start or end
			if (this.reducedStart && index <= this.currentPage - 2 && index != 1) {
				if (!reducedStartAdded) {
					reducedStartAdded = true
					buttons.push(this.getButtonPlaceholder())
				}
			} else if (
				this.reducedEnd &&
				index >= this.currentPage + 2 &&
				index != this.pages
			) {
				if (!reducedEndAdded) {
					reducedEndAdded = true
					buttons.push(this.getButtonPlaceholder())
				}
			} else {
				buttons.push(this.getPageButton(index))
			}
		}

		return buttons
	}

	render() {
		this.reducedStart = this.pages >= 8 && this.currentPage >= 5
		this.reducedEnd = this.pages >= 8 && this.currentPage <= this.pages - 4

		return html`
			${getGlobalStyleHtml()}

			<div class="container">
				${this.getBackButton()} ${this.getPageButtons()}
				${this.getForwardButton()}
			</div>
		`
	}
}
