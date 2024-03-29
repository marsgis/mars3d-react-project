import * as React from "react"
import type { DatePickerProps } from "antd/lib/date-picker"
import { DatePicker } from "antd"
import { PickerLocale } from "antd/es/date-picker/generatePicker"
import type { PickerDateProps } from "antd/es/date-picker/generatePicker"
import type { Moment } from "moment"
import momentGenerateConfig from "rc-picker/lib/generate/moment"
import "./index.less"
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")

export interface TimePickerProps extends Omit<PickerDateProps<Moment>, "picker"> {}

class LocalHelper {
  getDefinedChineseLocal() {
    const definedChineseLocal: PickerLocale = {
      lang: {
        locale: "zh_CN",
        placeholder: "请选择日期",
        rangePlaceholder: ["Start date", "End date"],
        today: "今天",
        now: "现在",
        backToToday: "Back to today",
        ok: "Ok",
        clear: "Clear",
        month: "Month",
        year: "Year",
        shortWeekDays: ["一", "二", "三", "四", "五", "六", "日"],
        timeSelect: "Select time",
        dateSelect: "Select date",
        monthSelect: "Choose a month",
        yearSelect: "Choose a year",
        decadeSelect: "Choose a decade",
        yearFormat: "YYYY年",
        dateFormat: "M/D/YYYY",
        dayFormat: "D",
        dateTimeFormat: "M/D/YYYY HH:mm:ss",
        monthFormat: "M月",
        monthBeforeYear: false,
        previousMonth: "Previous month (PageUp)",
        nextMonth: "Next month (PageDown)",
        previousYear: "Last year (Control + left)",
        nextYear: "Next year (Control + right)",
        previousDecade: "Last decade",
        nextDecade: "Next decade",
        previousCentury: "Last century",
        nextCentury: "Next century"
      },
      timePickerLocale: {
        placeholder: "Select time"
      },
      dateFormat: "YYYY-MM-DD",
      dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      weekFormat: "YYYY-wo",
      monthFormat: "YYYY-MM"
    }
    return definedChineseLocal
  }
}

const LocalFormat = new LocalHelper()

const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig)

export const MarsDatePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return (
    <MyDatePicker
      locale={LocalFormat.getDefinedChineseLocal()}
      className="mars-date-picker"
      popupClassName="mars-datepicker-dropdown"
      defaultValue={moment(new Date(), "YYYY-MM-DD")}
      {...props}
    />
  )
})
