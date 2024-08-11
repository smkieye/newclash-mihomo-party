import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem
} from '@nextui-org/react'
import React, { useState } from 'react'
import SettingItem from '../base/base-setting-item'
import dayjs from 'dayjs'
import { useOverrideConfig } from '@renderer/hooks/use-override-config'
interface Props {
  item: IProfileItem
  updateProfileItem: (item: IProfileItem) => Promise<void>
  onClose: () => void
}
const EditInfoModal: React.FC<Props> = (props) => {
  const { item, updateProfileItem, onClose } = props
  const { overrideConfig } = useOverrideConfig()
  const { items: overrideItems = [] } = overrideConfig || {}
  const [values, setValues] = useState(item)

  const onSave = async (): Promise<void> => {
    await updateProfileItem(values)
    onClose()
  }

  return (
    <Modal
      backdrop="blur"
      hideCloseButton
      isOpen={true}
      onOpenChange={onClose}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex">编辑信息</ModalHeader>
        <ModalBody>
          {values.type === 'remote' && item.extra?.expire && (
            <SettingItem title="订阅到期时间">
              <div className="h-[32px] leading-[32px]">
                {dayjs.unix(item.extra.expire).format('YYYY-MM-DD')}
              </div>
            </SettingItem>
          )}
          <SettingItem title="名称">
            <Input
              size="sm"
              className="w-[200px]"
              value={values.name}
              onValueChange={(v) => {
                setValues({ ...values, name: v })
              }}
            />
          </SettingItem>
          {values.type === 'remote' && (
            <SettingItem title="订阅地址">
              <Input
                size="sm"
                className="w-[200px]"
                value={values.url}
                onValueChange={(v) => {
                  setValues({ ...values, url: v })
                }}
              />
            </SettingItem>
          )}
          {values.type === 'remote' && (
            <SettingItem title="更新间隔（分钟）">
              <Input
                size="sm"
                type="number"
                className="w-[200px]"
                value={values.interval?.toString() ?? ''}
                onValueChange={(v) => {
                  setValues({ ...values, interval: parseInt(v) })
                }}
              />
            </SettingItem>
          )}
          <SettingItem title="覆写脚本">
            <Select
              className="w-[200px]"
              size="sm"
              selectionMode="multiple"
              selectedKeys={new Set(values.override || [])}
              onSelectionChange={(v) => {
                setValues({ ...values, override: Array.from(v).map((i) => i.toString()) })
              }}
            >
              {overrideItems.map((i) => (
                <SelectItem key={i.id}>{i.name}</SelectItem>
              ))}
            </Select>
          </SettingItem>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            取消
          </Button>
          <Button color="primary" onPress={onSave}>
            保存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EditInfoModal
