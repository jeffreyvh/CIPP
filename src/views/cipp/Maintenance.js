import React, { useState } from 'react'
import { Buffer } from 'buffer'
//import { CippCodeBlock } from 'src/components/utilities'
import { useLazyGenericGetRequestQuery } from 'src/store/api/app'
import {
  CButton,
  CForm,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
} from '@coreui/react'
import { Form } from 'react-final-form'
import { RFFCFormSelect } from 'src/components/forms'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faScroll } from '@fortawesome/free-solid-svg-icons'
import { CippCodeBlock } from 'src/components/utilities'

const Maintenance = () => {
  const [selectedScript, setSelectedScript] = useState()
  const [listBackend, listBackendResult] = useLazyGenericGetRequestQuery()
  const [listScript, listScriptResult] = useLazyGenericGetRequestQuery()
  const [listScriptLink, listScriptLinkResult] = useLazyGenericGetRequestQuery()

  const handleSubmit = async (values) => {
    listScript({ path: 'api/ExecMaintenanceScripts', params: values })
    setSelectedScript(values.ScriptFile)
  }

  const handleGetLink = () => {
    console.log('Making link')
    listScriptLink({
      path: 'api/ExecMaintenanceScripts',
      params: { ScriptFile: selectedScript, MakeLink: 'True' },
    })
  }
  return (
    <>
      {listBackendResult.isUninitialized && listBackend({ path: 'api/ExecMaintenanceScripts' })}
      <CRow>
        <CCol>
          <CCard className="options-card">
            <CCardHeader>
              <CCardTitle className="d-flex justify-content-between">Maintenance</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <Form
                initialValues={{}}
                onSubmit={handleSubmit}
                render={({ handleSubmit, submitting, values }) => {
                  return (
                    <CForm onSubmit={handleSubmit}>
                      <CRow>
                        {listBackendResult.isSuccess && (
                          <CCol>
                            <RFFCFormSelect
                              name="ScriptFile"
                              label="Script File"
                              placeholder="-- Select a script --"
                              values={listBackendResult.data.ScriptFiles}
                            />
                          </CCol>
                        )}
                      </CRow>
                      <CRow className="mb-3">
                        <CCol>
                          <CButton type="submit" disabled={submitting}>
                            <FontAwesomeIcon icon={faScroll} className="me-2" />
                            Load Script
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          {listScriptResult.isSuccess && (
            <CCard>
              <CCardHeader>
                <CCardTitle>Script Details</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <p>
                  <CButton type="submit" onClick={handleGetLink}>
                    <FontAwesomeIcon icon={faLink} className="me-2" />
                    Create Link
                  </CButton>
                </p>
                {listScriptLinkResult.isSuccess && (
                  <p>
                    {listScriptLinkResult.data.Link !== undefined && (
                      <>
                        Copy this text into a PowerShell terminal, we recommend Azure Cloud Shell.
                        The link is valid for 5 minutes.
                        <br />
                        <CippCodeBlock
                          language="text"
                          showLineNumbers={false}
                          wrapLongLines={true}
                          code={
                            'irm ' +
                            window.location.origin +
                            listScriptLinkResult.data.Link +
                            ' | iex'
                          }
                        />
                      </>
                    )}
                  </p>
                )}
                {listScriptResult.data.ScriptContent !== undefined && (
                  <p>
                    <h5>Maintenance Script Contents</h5>
                    <CippCodeBlock
                      language="powershell"
                      showLineNumbers={true}
                      wrapLongLines={true}
                      code={Buffer.from(listScriptResult.data.ScriptContent, 'base64').toString()}
                    />
                  </p>
                )}
              </CCardBody>
            </CCard>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default Maintenance